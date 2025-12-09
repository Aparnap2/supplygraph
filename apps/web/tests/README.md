# SupplyGraph Frontend Testing Strategy

This directory contains all tests for the SupplyGraph frontend application. Our testing approach follows the testing pyramid with multiple layers of validation.

## Testing Structure

```
tests/
├── setup.ts                 # Global test setup and mocks
├── components/              # Unit tests for UI components
├── integration/             # Integration tests for component interactions
├── e2e/                     # End-to-end tests with Playwright
├── auth/                    # Authentication flow tests
├── performance/             # Performance and memory tests
├── visual/                  # Visual regression tests
├── accessibility/           # A11y compliance tests
├── utils/                   # Test utilities and helpers
└── README.md               # This documentation
```

## Test Types

### 1. Unit Tests (`components/`)
Tests for individual components in isolation.
- **Coverage**: All AGUI components, UI components, utilities
- **Tools**: Vitest, React Testing Library
- **Example**: `ThinkingLoader.test.tsx`

### 2. Integration Tests (`integration/`)
Tests for multiple components working together.
- **Coverage**: WebSocket communication, AGUI system, API integrations
- **Tools**: Vitest, Custom WebSocket mocks
- **Example**: `websocket.test.tsx`

### 3. E2E Tests (`e2e/`)
Full user journey tests in real browsers.
- **Coverage**: Critical user flows, authentication, procurement workflow
- **Tools**: Playwright
- **Example**: `procurement-workflow.spec.ts`

### 4. Performance Tests (`performance/`)
Tests for component render performance and memory usage.
- **Coverage**: Render times, memory leaks, large datasets
- **Tools**: Vitest, Performance API
- **Example**: `performance.test.tsx`

### 5. Visual Regression Tests (`visual/`)
Snapshot tests to prevent UI regressions.
- **Coverage**: Component layouts, styling, responsive behavior
- **Tools**: Vitest, Jest snapshots
- **Example**: `components.snapshot.test.tsx`

### 6. Accessibility Tests (`accessibility/`)
Tests for WCAG compliance.
- **Coverage**: ARIA attributes, keyboard navigation, color contrast
- **Tools**: Jest-axe, React Testing Library
- **Example**: `a11y.test.tsx`

## Running Tests

### Development
```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run specific test categories
pnpm test:components
pnpm test:integration
pnpm test:performance
pnpm test:visual
pnpm test:a11y
```

### E2E Testing
```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Generate new tests
pnpm test:e2e:codegen

# Install Playwright browsers
pnpm playwright:install
```

### Coverage
```bash
# Generate coverage report
pnpm test:coverage

# View coverage in browser
open coverage/index.html
```

## Test Utilities

### Test Helpers (`utils/test-helpers.tsx`)
- `mockUserSession`: Mock authenticated user
- `mockFetch`: Mock API responses
- `createWebSocketMessage`: Create mock WebSocket messages
- `createAGUIEvent`: Create AGUI component events
- `createMockItems`: Generate mock data for components

### Mock Services
- **WebSocket**: Custom MockWebSocket class with event simulation
- **Authentication**: Better Auth mock with session management
- **API**: Fetch mock with response simulation

## Writing Tests

### Component Test Example
```typescript
import { render, screen } from '@/tests/utils/test-helpers'
import { ThinkingLoader } from '@/components/ThinkingLoader'

describe('ThinkingLoader', () => {
  it('should render with status', () => {
    render(<ThinkingLoader status="Loading..." />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('should complete procurement flow', async ({ page }) => {
  await page.goto('/procurement')

  await page.getByPlaceholder('Type your message...').fill('Need office supplies')
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByText('Fetching vendor quotes...')).toBeVisible()
})
```

## Test Standards

1. **AAA Pattern**: Arrange-Act-Assert
2. **One Assertion Per Test**: Keep tests focused
3. **Descriptive Names**: Tests should describe what they test
4. **Test Coverage**: Minimum 90% for new code
5. **Accessibility**: All components must pass a11y tests
6. **Performance**: Components must render within acceptable time limits

## CI/CD Integration

- Tests run on every PR
- E2E tests run on merge to main
- Coverage reports uploaded to CI
- Failing tests block deployment
- Visual regression failures reviewed manually

## Debugging

### Vitest Debugging
```bash
# Run specific test file
pnpm test path/to/test.test.tsx

# Run tests matching pattern
pnpm test --grep "component name"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/vitest run
```

### Playwright Debugging
```bash
# Run test with browser UI
pnpm test:e2e --debug

# Run test headed
pnpm test:e2e --headed

# Take screenshots on failure
pnpm test:e2e --screenshot=only-on-failure
```

## Best Practices

1. **Mock External Dependencies**: Never test real APIs in unit tests
2. **Use Test IDs**: Add data-testid for reliable element selection
3. **Clean Up After Tests**: Reset mocks and state
4. **Test User Interactions**: Focus on behavior, not implementation
5. **Responsive Testing**: Test on multiple screen sizes
6. **Error States**: Test error conditions and edge cases
7. **Loading States**: Test skeleton loaders and progress indicators

## Performance Benchmarks

- Component render: < 100ms
- Large dataset render: < 200ms
- Page load: < 3 seconds
- Memory usage: No leaks after 1000 re-renders

## Accessibility Checklist

- [ ] All buttons have accessible names
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] ARIA live regions for status updates
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Screen reader announcements
- [ ] Semantic HTML structure