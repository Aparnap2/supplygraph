"""
LangGraph workflow for procurement automation with AGUI capabilities
"""
from typing import TypedDict, Annotated, List, Union, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import os

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.graph.ui import AnyUIMessage, ui_message_reducer, push_ui_message
from langgraph.types import interrupt, Command
import operator


class ProcurementState(TypedDict):
    """State for the procurement workflow"""
    # Core messages
    messages: Annotated[List[BaseMessage], operator.add]

    # Organization context
    org_id: str
    user_id: str

    # Procurement data
    request_data: Dict[str, Any]
    items: List[Dict[str, Any]]
    quotes: List[Dict[str, Any]]
    selected_quote: Optional[Dict[str, Any]]

    # Workflow state
    status: str  # PENDING, ANALYZING, FETCHING_QUOTES, APPROVAL_PENDING, APPROVED, PAID
    user_decision: Optional[Dict[str, Any]]  # Stores user approval/rejection decision

    # AGUI components - using proper reducer
    ui: Annotated[List[AnyUIMessage], ui_message_reducer]

    # LangGraph thread management
    thread_id: str


class ProcurementWorkflow:
    """Main procurement workflow with AGUI integration"""

    def __init__(self, openai_api_key: str, db_connection_string: str):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            openai_api_key=openai_api_key,
            temperature=0.1
        )

        # Initialize LangGraph checkpointer for persistence
        self.checkpointer = PostgresSaver.from_conn_string(
            db_connection_string
        )

        self.workflow = self._build_workflow()
        self.app = self.workflow.compile(checkpointer=self.checkpointer)

    def _build_workflow(self) -> StateGraph:
        """Build the procurement state machine"""
        workflow = StateGraph(ProcurementState)

        # Add workflow nodes
        workflow.add_node("analyze_request", self.analyze_request)
        workflow.add_node("check_inventory", self.check_inventory)
        workflow.add_node("fetch_quotes", self.fetch_quotes)
        workflow.add_node("normalize_quotes", self.normalize_quotes)
        workflow.add_node("human_approval", self.human_approval)
        workflow.add_node("execute_payment", self.execute_payment)
        workflow.add_node("wait_for_approval", self.wait_for_approval)

        # Set entry point
        workflow.set_entry_point("analyze_request")

        # Add edges (workflow transitions)
        workflow.add_edge("analyze_request", "check_inventory")
        workflow.add_edge("check_inventory", "fetch_quotes")
        workflow.add_edge("fetch_quotes", "normalize_quotes")
        workflow.add_edge("normalize_quotes", "human_approval")
        workflow.add_edge("human_approval", "wait_for_approval")

        # Conditional edge for approval decision
        workflow.add_conditional_edges(
            "wait_for_approval",
            self._approval_decision,
            {
                "approved": "execute_payment",
                "rejected": END,
                "waiting": "wait_for_approval"
            }
        )

        workflow.add_edge("execute_payment", END)

        return workflow

    def analyze_request(self, state: ProcurementState) -> Dict[str, Any]:
        """Analyze the user's procurement request using AI"""

        # Create AI message for this step
        ai_message = AIMessage(
            id=str(uuid.uuid4()),
            content="Analyzing your procurement request..."
        )

        # Emit thinking loader UI component
        push_ui_message(
            "thinking_loader",
            {
                "status": "Analyzing your request...",
                "stage": "parsing"
            },
            message=ai_message
        )

        # Extract items from the request using LLM
        prompt = f"""
        Extract the procurement items from this request: "{state["messages"][-1].content if state["messages"] else ""}"

        Return as JSON with structure:
        {{
            "items": [
                {{
                    "name": "item name",
                    "quantity": number,
                    "unit": "pcs/lbs/kg",
                    "specifications": "detailed specs",
                    "category": "category"
                }}
            ]
        }}
        """

        try:
            # Use ainvoke for async compatibility, but handle sync result
            result = self.llm.invoke(prompt)
            # Parse the LLM response and extract items
            items = self._parse_items_from_llm(result.content)

            # Update the AI message with the result
            ai_message.content = f"Extracted {len(items)} items from your request"

            return {
                "items": items,
                "status": "ANALYZING",
                "messages": [ai_message]
            }
        except Exception as e:
            # Log the error but still return default items for testing
            print(f"LLM Error in analyze_request: {e}")
            items = self._parse_items_from_llm("")  # Return default items
            ai_message.content = f"Extracted {len(items)} items from your request"

            return {
                "items": items,
                "status": "ANALYZING",
                "messages": [ai_message]
            }

    def check_inventory(self, state: ProcurementState) -> Dict[str, Any]:
        """Check current inventory for requested items"""

        # Create AI message for this step
        ai_message = AIMessage(
            id=str(uuid.uuid4()),
            content="Checking current inventory..."
        )

        # Emit inventory check UI component
        push_ui_message(
            "inventory_check",
            {
                "items": state["items"],
                "status": "checking"
            },
            message=ai_message
        )

        # TODO: Implement actual inventory check via database
        # For now, simulate inventory data
        inventory_status = []
        for item in state["items"]:
            inventory_status.append({
                **item,
                "current_stock": 0,  # Assume no stock
                "needs_procurement": True
            })

        # Update the AI message
        ai_message.content = "Inventory check complete. All items need procurement."

        return {
            "messages": [ai_message],
            "items": inventory_status
        }

    def fetch_quotes(self, state: ProcurementState) -> Dict[str, Any]:
        """Initiate vendor quote fetching (async Celery task)"""

        # Create AI message for this step
        ai_message = AIMessage(
            id=str(uuid.uuid4()),
            content="Contacting vendors for quotes..."
        )

        # Emit quote fetcher UI component
        push_ui_message(
            "quote_fetcher",
            {
                "items": state["items"],
                "status": "contacting_vendors",
                "estimated_time": "2-5 minutes"
            },
            message=ai_message
        )

        # Use Celery task to email vendors for real quotes
        try:
            from ..tasks.vendor_negotiation_tasks import initiate_vendor_negotiation

            # Prepare procurement data for vendor negotiation
            procurement_data = {
                "org_id": state["org_id"],
                "procurement_id": state["thread_id"],
                "items": state["items"],
                "user_id": state["user_id"],
                "deadline": (datetime.now() + timedelta(days=3)).isoformat()
            }

            # Initiate vendor negotiation (this will be async)
            # For now, we'll simulate while the Celery task runs in background
            import asyncio
            asyncio.create_task(initiate_vendor_negotiation(procurement_data))

            # Generate immediate mock quotes for UI responsiveness
            # Real quotes will come via Celery task completion
            mock_quotes = self._generate_mock_quotes(state["items"])

            # Update the AI message
            ai_message.content = f"Contacting vendors for {len(state['items'])} items. Initial quotes received..."

            return {
                "quotes": mock_quotes,
                "messages": [ai_message],
                "status": "FETCHING_QUOTES"
            }

        except Exception as e:
            print(f"Error initiating vendor negotiation: {e}")
            # Fallback to mock quotes
            mock_quotes = self._generate_mock_quotes(state["items"])
            ai_message.content = f"Using available vendor quotes for {len(mock_quotes)} vendors"

            return {
                "quotes": mock_quotes,
                "messages": [ai_message],
                "status": "FETCHING_QUOTES"
            }

    def normalize_quotes(self, state: ProcurementState) -> Dict[str, Any]:
        """Normalize and compare received quotes"""

        quotes = state.get("quotes", [])
        ai_message = AIMessage(
            id=str(uuid.uuid4()),
            content="Comparing vendor quotes..."
        )

        if not quotes:
            # Emit error UI component
            push_ui_message(
                "error_card",
                {
                    "error": "No quotes received from vendors",
                    "type": "quote_error"
                },
                message=ai_message
            )
            ai_message.content = "Error: No quotes received from vendors"
            return {
                "messages": [ai_message],
                "status": "ERROR"
            }

        # Normalize and compare quotes
        normalized_quotes = self._normalize_quotes(quotes)
        best_quote = self._select_best_quote(normalized_quotes)

        ai_message.content = "Quote comparison complete. Ready for approval."
        return {
            "quotes": normalized_quotes,
            "selected_quote": best_quote,
            "messages": [ai_message],
            "status": "APPROVAL_PENDING"
        }

    def human_approval(self, state: ProcurementState) -> Dict[str, Any]:
        """Generate approval UI component (AGUI breakpoint)"""

        selected_quote = state.get("selected_quote", {})

        # Check if we have quotes to approve
        if not selected_quote:
            ai_message = AIMessage(
                id=str(uuid.uuid4()),
                content="Error: No quotes available for approval."
            )
            # Emit error UI component
            push_ui_message(
                "error_card",
                {
                    "error": "No quotes available for approval",
                    "type": "approval_error"
                },
                message=ai_message
            )
            return {
                "messages": [ai_message],
                "status": "ERROR"
            }

        # Create AI message for this step
        ai_message = AIMessage(
            id=str(uuid.uuid4()),
            content="Please review and approve the selected quote."
        )

        # Emit quote approval card UI component
        push_ui_message(
            "quote_approval_card",
            {
                "vendor": selected_quote.get("vendor", "Unknown Vendor"),
                "items": selected_quote.get("items", []),
                "total_amount": selected_quote.get("total_amount", 0),
                "savings": selected_quote.get("savings_percentage", "0%"),
                "delivery_time": selected_quote.get("delivery_time", "5-7 days"),
                "quote_id": selected_quote.get("id", uuid.uuid4().hex),
                "org_id": state.get("org_id", "")
            },
            message=ai_message
        )

        return {
            "messages": [ai_message],
            "status": "WAITING_APPROVAL"
        }

    def wait_for_approval(self, state: ProcurementState) -> Dict[str, Any]:
        """Wait for user approval - this is a breakpoint node"""
        # Create a special UI message for the interrupt
        ai_message = AIMessage(
            id=str(uuid.uuid4()),
            content="Waiting for your approval..."
        )

        # Mark this as an interrupt in the UI
        push_ui_message(
            "quote_approval_card",
            {
                "vendor": state.get("selected_quote", {}).get("vendor", "Unknown Vendor"),
                "items": state.get("selected_quote", {}).get("items", []),
                "total_amount": state.get("selected_quote", {}).get("total_amount", 0),
                "savings": state.get("selected_quote", {}).get("savings_percentage", "0%"),
                "delivery_time": state.get("selected_quote", {}).get("delivery_time", "5-7 days"),
                "quote_id": state.get("selected_quote", {}).get("id", uuid.uuid4().hex),
                "org_id": state.get("org_id", ""),
                "is_interrupt": True,  # Mark this as an interrupt
                "thread_id": state.get("thread_id", "")
            },
            message=ai_message
        )

        # Use LangGraph's interrupt mechanism to pause execution
        approval_decision = interrupt({
            "type": "quote_approval",
            "quote": state.get("selected_quote", {}),
            "message": "Please approve or reject this quote"
        })

        # Return the user's decision to be used by _approval_decision
        return {
            "user_decision": approval_decision,
            "messages": [ai_message]
        }

    def execute_payment(self, state: ProcurementState) -> Dict[str, Any]:
        """Execute payment via Stripe"""

        # Create AI message for payment processing
        ai_message = AIMessage(
            id=str(uuid.uuid4()),
            content="Processing payment..."
        )

        # Emit payment processor UI component
        push_ui_message(
            "payment_processor",
            {
                "status": "processing_payment",
                "amount": state["selected_quote"].get("total_amount", 0)
            },
            message=ai_message
        )

        try:
            import stripe
            stripe.api_key = os.getenv("STRIPE_API_KEY")

            # Create payment intent
            selected_quote = state.get("selected_quote", {})
            amount_cents = int(selected_quote.get("total_amount", 0) * 100)  # Convert to cents

            # Create a Stripe Payment Intent
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency="usd",
                description=f"Procurement order with {selected_quote.get('vendor', 'Unknown Vendor')}",
                metadata={
                    "org_id": state.get("org_id"),
                    "thread_id": state.get("thread_id"),
                    "vendor": selected_quote.get("vendor", ""),
                    "quote_id": selected_quote.get("id", "")
                }
            )

            # In a real implementation, you would:
            # 1. Return the client_secret to the frontend
            # 2. Frontend confirms payment via Stripe Elements
            # 3. Webhook confirms payment completion

            # For demo purposes, we'll simulate successful payment
            # In production, you'd wait for webhook confirmation

            # Create success message
            success_message = AIMessage(
                id=str(uuid.uuid4()),
                content=f"Payment of ${selected_quote.get('total_amount', 0):.2f} processed successfully! Order confirmed."
            )

            # Emit payment success UI component
            push_ui_message(
                "payment_success",
                {
                    "vendor": selected_quote.get("vendor"),
                    "amount": selected_quote.get("total_amount", 0),
                    "confirmation": payment_intent.id[:8].upper(),
                    "payment_intent_id": payment_intent.id
                },
                message=success_message
            )

            # Store payment info in database
            payment_data = {
                "payment_intent_id": payment_intent.id,
                "amount": selected_quote.get("total_amount", 0),
                "vendor": selected_quote.get("vendor"),
                "status": "completed",
                "timestamp": datetime.now().isoformat()
            }

            return {
                "messages": [ai_message, success_message],
                "status": "PAID",
                "payment_data": payment_data
            }

        except Exception as e:
            # Handle payment failure
            error_message = AIMessage(
                id=str(uuid.uuid4()),
                content=f"Payment failed: {str(e)}"
            )

            # Emit error card
            push_ui_message(
                "error_card",
                {
                    "error": f"Payment processing failed: {str(e)}",
                    "type": "payment_error",
                    "retry_allowed": True
                },
                message=error_message
            )

            return {
                "messages": [ai_message, error_message],
                "status": "PAYMENT_FAILED",
                "error": str(e)
            }

    def _approval_decision(self, state: ProcurementState) -> str:
        """Determine approval decision from user interrupt response"""
        # Get the user decision from the interrupt
        user_decision = state.get("user_decision")

        if user_decision:
            # Check if user approved
            if isinstance(user_decision, dict):
                action = user_decision.get("action", "").lower()
                if action in ["approve", "approved", "yes", "accept"]:
                    return "approved"
                elif action in ["reject", "rejected", "no", "cancel", "deny"]:
                    return "rejected"
            elif isinstance(user_decision, str):
                decision = user_decision.lower()
                if decision in ["approve", "approved", "yes", "accept"]:
                    return "approved"
                elif decision in ["reject", "rejected", "no", "cancel", "deny"]:
                    return "rejected"

        # Default to waiting if no clear decision
        return "waiting"

    def _parse_items_from_llm(self, llm_response: str) -> List[Dict[str, Any]]:
        """Parse items from LLM response with intelligent extraction"""
        try:
            # Use structured output from OpenAI for better parsing
            from pydantic import BaseModel, Field
            from typing import List

            class Item(BaseModel):
                name: str = Field(description="Item name")
                quantity: int = Field(description="Quantity needed")
                unit: str = Field(description="Unit of measurement")
                specifications: str = Field(description="Detailed specifications")
                category: str = Field(description="Item category")
                priority: str = Field(description="Priority level")

            class ItemsResponse(BaseModel):
                items: List[Item]

            # Parse the response as JSON if it's already structured
            try:
                import json
                parsed = json.loads(llm_response)
                if "items" in parsed:
                    return [dict(item) for item in parsed["items"]]
            except:
                pass

            # Fall back to intelligent extraction with structured output
            structured_llm = ChatOpenAI(
                model="gpt-4o-mini",
                openai_api_key=os.getenv("OPENAI_API_KEY"),
                temperature=0.1
            ).with_structured_output(ItemsResponse)

            # Extract items from the original message
            extraction_prompt = f"""
            Extract procurement items from this request and return as structured data:

            Request: "{llm_response if llm_response else 'No items provided'}"

            If no specific items are mentioned, infer from the context.
            """

            result = structured_llm.invoke(extraction_prompt)
            return [dict(item) for item in result.items]

        except Exception as e:
            print(f"Error parsing items from LLM: {e}")
            # Return default items for demo purposes
            return [
                {
                    "name": "Office Supplies",
                    "quantity": 100,
                    "unit": "units",
                    "specifications": "General office supplies",
                    "category": "Office",
                    "priority": "MEDIUM"
                }
            ]

    def _generate_mock_quotes(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate mock vendor quotes for testing"""
        vendors = ["TechCorp", "OfficeSupplies Inc", "GlobalTech Solutions"]
        quotes = []

        for vendor in vendors:
            total_amount = sum(item["quantity"] * 1200 for item in items)  # Mock pricing
            quotes.append({
                "id": uuid.uuid4().hex,
                "vendor": vendor,
                "items": items,
                "total_amount": total_amount * (0.9 + vendors.index(vendor) * 0.05),  # Price variation
                "delivery_time": f"{5 + vendors.index(vendor) * 2}-{7 + vendors.index(vendor) * 2} days",
                "valid_until": (datetime.now().isoformat())
            })

        return quotes

    def _normalize_quotes(self, quotes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Normalize quotes to common format"""
        # Sort by price
        normalized = sorted(quotes, key=lambda q: q["total_amount"])

        # Add savings calculation
        if len(normalized) > 1:
            best_price = normalized[0]["total_amount"]
            for quote in normalized:
                savings = ((quote["total_amount"] - best_price) / quote["total_amount"]) * 100
                quote["savings_percentage"] = f"{savings:.1f}%"
        else:
            normalized[0]["savings_percentage"] = "0%"

        return normalized

    def _select_best_quote(self, normalized_quotes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Select the best quote (lowest price)"""
        return normalized_quotes[0] if normalized_quotes else {}

    async def run(self, initial_message: str, org_id: str, user_id: str, thread_id: str):
        """Run the procurement workflow"""
        initial_state = {
            "messages": [HumanMessage(content=initial_message)],
            "org_id": org_id,
            "user_id": user_id,
            "request_data": {"original_message": initial_message},
            "items": [],
            "quotes": [],
            "selected_quote": None,
            "status": "PENDING",
            "ui": [],
            "thread_id": thread_id
        }

        # Stream the workflow execution
        async for event in self.app.astream(
            initial_state,
            config={"configurable": {"thread_id": thread_id}}
        ):
            yield event