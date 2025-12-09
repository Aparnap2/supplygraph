This is a comprehensive "Senior Engineer" packet for **SupplyGraph**. It is designed for a **local-first v1** (Docker Compose) that scales to a multi-tenant SaaS.

It combines **TanStack Start** (Frontend/BFF), **Python/LangGraph** (AI Engine), and **Better Auth** (Multi-tenancy) into a cohesive Agentic SaaS.

***

## 1. System Design & Architecture

### High-Level Topology
We use a **Sidecar Architecture**. The Node.js app handles the user session, CRUD, and view rendering. The Python service is a pure "Intelligence API" that streams LangGraph events.

```mermaid
graph TD
    User[User (Browser)] -->|HTTPS / WebSocket| TSS[TanStack Start App (Node.js)]
    
    subgraph "Application Layer (TypeScript)"
        TSS -->|Auth & Session| BA[Better Auth]
        TSS -->|Data Access| Prisma[Prisma ORM]
    end
    
    subgraph "Intelligence Layer (Python)"
        TSS -->|gRPC/HTTP Streaming| AI[FastAPI + LangGraph Service]
        AI -->|Async Tasks| Celery[Celery Workers]
        AI -->|LLM Routing| LiteLLM[LiteLLM Proxy]
    end
    
    subgraph "Data Layer"
        Prisma --> DB[(Postgres - Supabase)]
        AI --> DB
        Celery --> Redis[(Redis - Broker/Cache)]
    end
    
    subgraph "External"
        AI --> Stripe[Stripe API]
        AI --> Gmail[Gmail/SMTP]
    end
```

### The AGUI Protocol Implementation
Since AGUI (Agent-User Interface) is about server-driven UI, we map LangGraph **events** to Shadcn **component names**.
1.  **LangGraph** emits a structured chunk: `{ "type": "ui_render", "component": "PriceComparisonTable", "props": { ...data } }`.
2.  **TanStack Start** receives the stream and dynamically imports the matching Shadcn component.
3.  **User Action** (e.g., clicking "Approve") sends a payload back to LangGraph to `resume` the graph state.

***

## 2. Product Requirements Document (PRD) - v1

### Core Objective
Automate the "Procurement-to-Pay" cycle for SMEs.

### Key Features (Multi-Tenant)
1.  **Workspace Isolation:** Users belong to Organizations (Better Auth). All data is keyed by `orgId`.
2.  **Smart Ingestion:** Drag-and-drop CSV/Excel. Agent maps columns to schema automatically.
3.  **Agentic Negotiation:** Agent sends emails to vendors (via Celery) to request updated pricing.
4.  **AGUI Approval:** Agent cannot pay without human approval. This is rendered as a "Payment Card" in the chat stream.

***

## 3. Workflow: The "Procurement State Machine"

We use **LangGraph** to define the lifecycle.

**Nodes:**
1.  `ingest_request`: Parse the user's unstructured request ("Buy 50 laptops").
2.  `check_inventory`: (Tool) Query ERP/DB for current stock.
3.  `fetch_quotes`: (Async) Trigger Celery tasks to email vendors. *Wait for signal.*
4.  `normalize_quotes`: Compare received quotes.
5.  `human_approval`: **(Breakpoint)** Pause graph. Emit `ApprovalComponent` to UI.
6.  `execute_payment`: (Tool) Call Stripe API.

***

## 4. Coding Instructions & Snippets

### Part A: Database (Prisma + Multi-tenancy)
*Using Prisma's latest features.*

```typescript
// schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema", "typedSql"] // Enable new features
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String       @id
  name          String
  email         String       @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]
  // Better Auth Multi-tenancy
  memberships   Member[]

  @@map("user")
}

model Organization {
  id          String   @id
  name        String
  slug        String   @unique
  createdAt   DateTime @default(now())
  members     Member[]
  
  // Domain Logic
  inventory   Product[]
  procurements ProcurementRequest[]

  @@map("organization")
}

model Member {
  id             String       @id
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  role           String
  
  @@map("member")
}

model ProcurementRequest {
  id          String   @id @default(cuid())
  orgId       String
  organization Organization @relation(fields: [orgId], references: [id])
  status      String   @default("PENDING") // DRAFT, NEGOTIATING, APPROVED, PAID
  
  // LangGraph Checkpointer ID
  threadId    String   @unique 
  
  // Structured Data
  items       Json
  quotes      Json
}
```

### Part B: Auth (Better Auth + TanStack Start)
*Setup for Multi-tenancy.*

```typescript
// app/utils/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { prisma } from "./db";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    plugins: [
        organization({
            async sendInvitationEmail(data) {
                // Implement email logic
            },
        }) 
    ],
    emailAndPassword: {
        enabled: true
    }
});
```

### Part C: The Intelligence Service (Python + LangGraph + AGUI)
*This runs as a separate FastAPI service.*

**Folder Structure:**
`/ai-service/agent/graph.py`

```python
from typing import TypedDict, Annotated, List, Union
from langgraph.graph import StateGraph, END
from langchain_core.messages import AnyMessage, SystemMessage, ToolMessage
import operator

# 1. Define State
class AgentState(TypedDict):
    messages: Annotated[List[AnyMessage], operator.add]
    org_id: str
    quotes: List[dict]
    selected_quote: Union[dict, None]
    # AGUI Control
    ui_component: str 
    ui_props: dict

# 2. Nodes
def analyze_request(state: AgentState):
    # ... LLM logic to extract items needed ...
    return {"ui_component": "ThinkingLoader", "ui_props": {"status": "Analyzing inventory..."}}

def draft_comparison(state: AgentState):
    # Compare quotes logic
    best_quote = state['quotes'][0] # Simplified
    
    # CRITICAL: Set the UI to render the Approval Card
    return {
        "ui_component": "QuoteApprovalCard",
        "ui_props": {
            "vendor": best_quote['vendor'],
            "amount": best_quote['amount'],
            "savings": "12%",
            "csv_data": state['quotes']
        }
    }

def execute_stripe_payment(state: AgentState):
    # User approved via UI, now we pay
    return {"messages": [SystemMessage(content="Payment Sent via Stripe!")]}

# 3. Graph Construction
workflow = StateGraph(AgentState)

workflow.add_node("analyze", analyze_request)
workflow.add_node("human_review", draft_comparison)
workflow.add_node("pay", execute_stripe_payment)

workflow.set_entry_point("analyze")
workflow.add_edge("analyze", "human_review")

# 4. The AGUI Interrupt
# We interrupt BEFORE payment to force the UI to render the Approval Card and wait
workflow.add_node("wait_for_user", lambda x: x) # No-op node to hold state
workflow.add_edge("human_review", "wait_for_user")
workflow.add_conditional_edges(
    "wait_for_user",
    lambda state: "pay" if state.get("user_action") == "APPROVED" else END
)

app = workflow.compile(checkpointer=...) # Use PostgresCheckpointer
```

### Part D: Frontend (TanStack Start + AGUI Stream)
*Consuming the stream and rendering components.*

```tsx
// app/routes/dashboard/procurement.tsx
import { useStream } from '@tanstack/start/client' // Hypothetical hook or use generic fetch stream
import { QuoteApprovalCard } from '~/components/agui/quote-card'
import { ThinkingLoader } from '~/components/agui/loader'

// 1. Component Map (The "AGUI Registry")
const AGUI_COMPONENTS = {
  QuoteApprovalCard: QuoteApprovalCard,
  ThinkingLoader: ThinkingLoader,
  Default: ({ message }) => <div className="p-4 bg-muted">{message}</div>
}

export default function ProcurementChat() {
  const [history, setHistory] = useState([])
  
  // 2. Stream Handler
  const { submit, messages } = useChat({
    api: '/api/agent/chat', // Proxy to Python service
    onResponse: (response) => {
      // Custom parser to handle JSON chunks for UI components
      // If chunk.type === 'ui_render', push to history with component metadata
    }
  })

  return (
    <div className="flex flex-col gap-4">
      {history.map((msg, idx) => {
        // 3. Dynamic Rendering
        if (msg.type === 'ui_render') {
            const Component = AGUI_COMPONENTS[msg.component] || AGUI_COMPONENTS.Default
            return <Component key={idx} {...msg.props} onAction={submit} />
        }
        return <div key={idx}>{msg.content}</div>
      })}
    </div>
  )
}
```
# How to implement generative user interfaces with LangGraph

<Info>
  **Prerequisites**

  * [LangSmith](/langsmith/home)
  * [Agent Server](/langsmith/agent-server)
  * [`useStream()` React Hook](/langsmith/use-stream-react)
</Info>

Generative user interfaces (Generative UI) allows agents to go beyond text and generate rich user interfaces. This enables creating more interactive and context-aware applications where the UI adapts based on the conversation flow and AI responses.

<img src="https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=105943c6c28853fad0a9bc3b4af3a999" alt="Agent Chat showing a prompt about booking/lodging and a generated set of hotel listing cards (images, titles, prices, locations) rendered inline as UI components." data-og-width="1814" width="1814" data-og-height="898" height="898" data-path="langsmith/images/generative-ui-sample.jpg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=280&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=0fd526a7132d33ab6f72002d68a66dec 280w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=560&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=0c9ffe86700a7b8404f1fdf51b906aa1 560w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=840&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=50652e58566db8171ead4aef57d78fa6 840w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=1100&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=a764d790719e8233313fabe4cee93958 1100w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=1650&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=a02d8d6ecace7eee6df55e3a391c09e2 1650w, https://mintcdn.com/langchain-5e9cc07a/JOyLr_spVEW0t2KF/langsmith/images/generative-ui-sample.jpg?w=2500&fit=max&auto=format&n=JOyLr_spVEW0t2KF&q=85&s=b0709ca94bd9533f5ef5a80da1d60bf6 2500w" />

LangSmith supports colocating your React components with your graph code. This allows you to focus on building specific UI components for your graph while easily plugging into existing chat interfaces such as [Agent Chat](https://agentchat.vercel.app) and loading the code only when actually needed.

## Tutorial

### 1. Define and configure UI components

First, create your first UI component. For each component you need to provide an unique identifier that will be used to reference the component in your graph code.

```tsx title="src/agent/ui.tsx" theme={null}
const WeatherComponent = (props: { city: string }) => {
  return <div>Weather for {props.city}</div>;
};

export default {
  weather: WeatherComponent,
};
```

Next, define your UI components in your `langgraph.json` configuration:

```json  theme={null}
{
  "node_version": "20",
  "graphs": {
    "agent": "./src/agent/index.ts:graph"
  },
  "ui": {
    "agent": "./src/agent/ui.tsx"
  }
}
```

The `ui` section points to the UI components that will be used by graphs. By default, we recommend using the same key as the graph name, but you can split out the components however you like, see [Customise the namespace of UI components](#customise-the-namespace-of-ui-components) for more details.

LangSmith will automatically bundle your UI components code and styles and serve them as external assets that can be loaded by the `LoadExternalComponent` component. Some dependencies such as `react` and `react-dom` will be automatically excluded from the bundle.

CSS and Tailwind 4.x is also supported out of the box, so you can freely use Tailwind classes as well as `shadcn/ui` in your UI components.

<Tabs>
  <Tab title="src/agent/ui.tsx">
    ```tsx  theme={null}
    import "./styles.css";

    const WeatherComponent = (props: { city: string }) => {
      return <div className="bg-red-500">Weather for {props.city}</div>;
    };

    export default {
      weather: WeatherComponent,
    };
    ```
  </Tab>

  <Tab title="src/agent/styles.css">
    ```css  theme={null}
    @import "tailwindcss";
    ```
  </Tab>
</Tabs>

### 2. Send the UI components in your graph

<Tabs>
  <Tab title="Python">
    ```python title="src/agent.py" theme={null}
    import uuid
    from typing import Annotated, Sequence, TypedDict

    from langchain.messages import AIMessage
    from langchain_core.messages import BaseMessage
    from langchain_openai import ChatOpenAI
    from langgraph.graph import StateGraph
    from langgraph.graph.message import add_messages
    from langgraph.graph.ui import AnyUIMessage, ui_message_reducer, push_ui_message


    class AgentState(TypedDict):  # noqa: D101
        messages: Annotated[Sequence[BaseMessage], add_messages]
        ui: Annotated[Sequence[AnyUIMessage], ui_message_reducer]


    async def weather(state: AgentState):
        class WeatherOutput(TypedDict):
            city: str

        weather: WeatherOutput = (
            await ChatOpenAI(model="gpt-4o-mini")
            .with_structured_output(WeatherOutput)
            .with_config({"tags": ["nostream"]})
            .ainvoke(state["messages"])
        )

        message = AIMessage(
            id=str(uuid.uuid4()),
            content=f"Here's the weather for {weather['city']}",
        )

        # Emit UI elements associated with the message
        push_ui_message("weather", weather, message=message)
        return {"messages": [message]}


    workflow = StateGraph(AgentState)
    workflow.add_node(weather)
    workflow.add_edge("__start__", "weather")
    graph = workflow.compile()
    ```
  </Tab>

  <Tab title="JS">
    Use the `typedUi` utility to emit UI elements from your agent nodes:

    ```typescript title="src/agent/index.ts" theme={null}
    import {
      typedUi,
      uiMessageReducer,
    } from "@langchain/langgraph-sdk/react-ui/server";

    import { ChatOpenAI } from "@langchain/openai";
    import { v4 as uuidv4 } from "uuid";
    import { z } from "zod";

    import type ComponentMap from "./ui.js";

    import {
      Annotation,
      MessagesAnnotation,
      StateGraph,
      type LangGraphRunnableConfig,
    } from "@langchain/langgraph";

    const AgentState = Annotation.Root({
      ...MessagesAnnotation.spec,
      ui: Annotation({ reducer: uiMessageReducer, default: () => [] }),
    });

    export const graph = new StateGraph(AgentState)
      .addNode("weather", async (state, config) => {
        // Provide the type of the component map to ensure
        // type safety of `ui.push()` calls as well as
        // pushing the messages to the `ui` and sending a custom event as well.
        const ui = typedUi<typeof ComponentMap>(config);

        const weather = await new ChatOpenAI({ model: "gpt-4o-mini" })
          .withStructuredOutput(z.object({ city: z.string() }))
          .withConfig({ tags: ["nostream"] })
          .invoke(state.messages);

        const response = {
          id: uuidv4(),
          type: "ai",
          content: `Here's the weather for ${weather.city}`,
        };

        // Emit UI elements associated with the AI message
        ui.push({ name: "weather", props: weather }, { message: response });

        return { messages: [response] };
      })
      .addEdge("__start__", "weather")
      .compile();
    ```
  </Tab>
</Tabs>

### 3. Handle UI elements in your React application

On the client side, you can use `useStream()` and `LoadExternalComponent` to display the UI elements.

```tsx title="src/app/page.tsx" theme={null}
"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";

export default function Page() {
  const { thread, values } = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
  });

  return (
    <div>
      {thread.messages.map((message) => (
        <div key={message.id}>
          {message.content}
          {values.ui
            ?.filter((ui) => ui.metadata?.message_id === message.id)
            .map((ui) => (
              <LoadExternalComponent key={ui.id} stream={thread} message={ui} />
            ))}
        </div>
      ))}
    </div>
  );
}
```

Behind the scenes, `LoadExternalComponent` will fetch the JS and CSS for the UI components from LangSmith and render them in a shadow DOM, thus ensuring style isolation from the rest of your application.

## How-to guides

### Provide custom components on the client side

If you already have the components loaded in your client application, you can provide a map of such components to be rendered directly without fetching the UI code from LangSmith.

```tsx  theme={null}
const clientComponents = {
  weather: WeatherComponent,
};

<LoadExternalComponent
  stream={thread}
  message={ui}
  components={clientComponents}
/>;
```

### Show loading UI when components are loading

You can provide a fallback UI to be rendered when the components are loading.

```tsx  theme={null}
<LoadExternalComponent
  stream={thread}
  message={ui}
  fallback={<div>Loading...</div>}
/>
```

### Customise the namespace of UI components.

By default `LoadExternalComponent` will use the `assistantId` from `useStream()` hook to fetch the code for UI components. You can customise this by providing a `namespace` prop to the `LoadExternalComponent` component.

<Tabs>
  <Tab title="src/app/page.tsx">
    ```tsx  theme={null}
    <LoadExternalComponent
      stream={thread}
      message={ui}
      namespace="custom-namespace"
    />
    ```
  </Tab>

  <Tab title="langgraph.json">
    ```json  theme={null}
    {
      "ui": {
        "custom-namespace": "./src/agent/ui.tsx"
      }
    }
    ```
  </Tab>
</Tabs>

### Access and interact with the thread state from the UI component

You can access the thread state inside the UI component by using the `useStreamContext` hook.

```tsx  theme={null}
import { useStreamContext } from "@langchain/langgraph-sdk/react-ui";

const WeatherComponent = (props: { city: string }) => {
  const { thread, submit } = useStreamContext();
  return (
    <>
      <div>Weather for {props.city}</div>

      <button
        onClick={() => {
          const newMessage = {
            type: "human",
            content: `What's the weather in ${props.city}?`,
          };

          submit({ messages: [newMessage] });
        }}
      >
        Retry
      </button>
    </>
  );
};
```

### Pass additional context to the client components

You can pass additional context to the client components by providing a `meta` prop to the `LoadExternalComponent` component.

```tsx  theme={null}
<LoadExternalComponent stream={thread} message={ui} meta={{ userId: "123" }} />
```

Then, you can access the `meta` prop in the UI component by using the `useStreamContext` hook.

```tsx  theme={null}
import { useStreamContext } from "@langchain/langgraph-sdk/react-ui";

const WeatherComponent = (props: { city: string }) => {
  const { meta } = useStreamContext<
    { city: string },
    { MetaType: { userId?: string } }
  >();

  return (
    <div>
      Weather for {props.city} (user: {meta?.userId})
    </div>
  );
};
```

### Streaming UI messages from the server

You can stream UI messages before the node execution is finished by using the `onCustomEvent` callback of the `useStream()` hook. This is especially useful when updating the UI component as the LLM is generating the response.

```tsx  theme={null}
import { uiMessageReducer } from "@langchain/langgraph-sdk/react-ui";

const { thread, submit } = useStream({
  apiUrl: "http://localhost:2024",
  assistantId: "agent",
  onCustomEvent: (event, options) => {
    options.mutate((prev) => {
      const ui = uiMessageReducer(prev.ui ?? [], event);
      return { ...prev, ui };
    });
  },
});
```

Then you can push updates to the UI component by calling `ui.push()` / `push_ui_message()` with the same ID as the UI message you wish to update.

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from typing import Annotated, Sequence, TypedDict

    from langchain_anthropic import ChatAnthropic
    from langchain.messages import AIMessage, AIMessageChunk, BaseMessage
    from langgraph.graph import StateGraph
    from langgraph.graph.message import add_messages
    from langgraph.graph.ui import AnyUIMessage, push_ui_message, ui_message_reducer


    class AgentState(TypedDict):  # noqa: D101
        messages: Annotated[Sequence[BaseMessage], add_messages]
        ui: Annotated[Sequence[AnyUIMessage], ui_message_reducer]


    class CreateTextDocument(TypedDict):
        """Prepare a document heading for the user."""

        title: str


    async def writer_node(state: AgentState):
        model = ChatAnthropic(model="claude-sonnet-4-5-20250929")
        message: AIMessage = await model.bind_tools(
            tools=[CreateTextDocument],
            tool_choice={"type": "tool", "name": "CreateTextDocument"},
        ).ainvoke(state["messages"])

        tool_call = next(
            (x["args"] for x in message.tool_calls if x["name"] == "CreateTextDocument"),
            None,
        )

        if tool_call:
            ui_message = push_ui_message("writer", tool_call, message=message)
            ui_message_id = ui_message["id"]

            # We're already streaming the LLM response to the client through UI messages
            # so we don't need to stream it again to the `messages` stream mode.
            content_stream = model.with_config({"tags": ["nostream"]}).astream(
                f"Create a document with the title: {tool_call['title']}"
            )

            content: AIMessageChunk | None = None
            async for chunk in content_stream:
                content = content + chunk if content else chunk

                push_ui_message(
                    "writer",
                    {"content": content.text()},
                    id=ui_message_id,
                    message=message,
                    # Use `merge=rue` to merge props with the existing UI message
                    merge=True,
                )

        return {"messages": [message]}
    ```
  </Tab>

  <Tab title="JS">
    ```tsx  theme={null}
    import {
      Annotation,
      MessagesAnnotation,
      type LangGraphRunnableConfig,
    } from "@langchain/langgraph";
    import { z } from "zod";
    import { ChatAnthropic } from "@langchain/anthropic";
    import {
      typedUi,
      uiMessageReducer,
    } from "@langchain/langgraph-sdk/react-ui/server";
    import type { AIMessageChunk } from "@langchain/core/messages";

    import type ComponentMap from "./ui";

    const AgentState = Annotation.Root({
      ...MessagesAnnotation.spec,
      ui: Annotation({ reducer: uiMessageReducer, default: () => [] }),
    });

    async function writerNode(
      state: typeof AgentState.State,
      config: LangGraphRunnableConfig
    ): Promise<typeof AgentState.Update> {
      const ui = typedUi<typeof ComponentMap>(config);

      const model = new ChatAnthropic({ model: "claude-sonnet-4-5-20250929" });
      const message = await model
        .bindTools(
          [
            {
              name: "create_text_document",
              description: "Prepare a document heading for the user.",
              schema: z.object({ title: z.string() }),
            },
          ],
          { tool_choice: { type: "tool", name: "create_text_document" } }
        )
        .invoke(state.messages);

      type ToolCall = { name: "create_text_document"; args: { title: string } };
      const toolCall = message.tool_calls?.find(
        (tool): tool is ToolCall => tool.name === "create_text_document"
      );

      if (toolCall) {
        const { id, name } = ui.push(
          { name: "writer", props: { title: toolCall.args.title } },
          { message }
        );

        const contentStream = await model
          // We're already streaming the LLM response to the client through UI messages
          // so we don't need to stream it again to the `messages` stream mode.
          .withConfig({ tags: ["nostream"] })
          .stream(`Create a short poem with the topic: ${message.text}`);

        let content: AIMessageChunk | undefined;
        for await (const chunk of contentStream) {
          content = content?.concat(chunk) ?? chunk;

          ui.push(
            { id, name, props: { content: content?.text } },
            // Use `merge: true` to merge props with the existing UI message
            { message, merge: true }
          );
        }
      }

      return { messages: [message] };
    }
    ```
  </Tab>

  <Tab title="ui.tsx">
    ```tsx  theme={null}
    function WriterComponent(props: { title: string; content?: string }) {
      return (
        <article>
          <h2>{props.title}</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{props.content}</p>
        </article>
      );
    }

    export default {
      weather: WriterComponent,
    };
    ```
  </Tab>
</Tabs>

### Remove UI messages from state

Similar to how messages can be removed from the state by appending a RemoveMessage you can remove an UI message from the state by calling `remove_ui_message` / `ui.delete` with the ID of the UI message.

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from langgraph.graph.ui import push_ui_message, delete_ui_message

    # push message
    message = push_ui_message("weather", {"city": "London"})

    # remove said message
    delete_ui_message(message["id"])
    ```
  </Tab>

  <Tab title="JS">
    ```tsx  theme={null}
    // push message
    const message = ui.push({ name: "weather", props: { city: "London" } });

    // remove said message
    ui.delete(message.id);
    ```
  </Tab>
</Tabs>

## Learn more

* [JS/TS SDK Reference](https://langchain-ai.github.io/langgraphjs/reference/modules/sdk.html)

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/langsmith/generative-ui-react.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt
***

## 5. SOP: Development & Deployment

### Phase 1: Local Development
1.  **Clone & Env:** Set up `.env` with `OPENAI_API_KEY`, `STRIPE_SECRET`, `DATABASE_URL`.
2.  **Docker Compose:**
    *   `postgres`: DB.
    *   `redis`: For Celery broker and LangGraph checkpoints.
    *   `mailpit`: To capture local emails sent by the agent (don't spam real vendors).
3.  **Migrations:** Run `npx prisma migrate dev`.
4.  **Seed:** Create a test Organization and Tenant using a seed script.

### Phase 2: Testing the "Vertical" Logic
1.  **Test 1 (Ingest):** Upload a messy CSV. Ensure Python service cleans it using Pandas and returns JSON.
2.  **Test 2 (AGUI):** Trigger the agent. Ensure the Frontend *stops* and renders the `QuoteApprovalCard`.
3.  **Test 3 (Resume):** Click "Approve" on the UI. Ensure LangGraph resumes the thread (`graph.stream(..., config={"thread_id": "x"})`) and executes the payment tool.

### Phase 3: Production (Self-Hosted)
1.  **Build:** Dockerize the Next.js app and the Python API separately.
2.  **Reverse Proxy:** Use Nginx or Traefik to route `/api/ai/*` to the Python container and everything else to Node.
3.  **Observability:** Connect LangGraph to **Arize Phoenix** (as per your preference) to trace the `thread_id` flows.

## 6. Coding "Vibe" Instructions (for your Agent)
*Copy/Paste this into your IDE Agent (Cursor/Windsurf)*

> "I am building SupplyGraph. It is a multi-tenant SaaS using TanStack Start and Better Auth.
> 
> **Backend Rule:** All database access must go through Prisma. Ensure `orgId` is checked in every query.
> **AI Rule:** The Python service manages LangGraph. It acts as the 'Brain'. It does not return text; it returns 'AGUI Events' (JSON objects specifying which UI component to render).
> **Frontend Rule:** Create a 'Chat Interface' that isn't just text. It essentially renders a stream of React Components based on the AI's state.
> 
> **Task:** Initialize the repository structure. Set up the Monorepo with `/apps/web` (TanStack Start) and `/apps/api` (FastAPI). Configure Docker Compose to network them together with Postgres and Redis."
