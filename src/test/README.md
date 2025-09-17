# Testing Documentation for BoringFunnel

This document provides comprehensive guidance for running, maintaining, and extending the test suite for the BoringFunnel project.

## Overview

The BoringFunnel project uses **Vitest** with **React Testing Library** for comprehensive testing of React components, custom hooks, and integration scenarios. The test suite covers:

- **Unit Tests**: Custom hooks and utility functions
- **Component Tests**: UI components with full user interaction testing
- **Integration Tests**: Form submission flows, analytics tracking, and theme switching
- **CRO Component Tests**: Conversion rate optimization components

## Test Structure

```
src/test/
├── README.md                    # This documentation
├── setup.ts                     # Test environment setup
├── test-utils.tsx              # Custom render utilities and mocks
├── hooks/                      # Custom hook tests
│   ├── use-local-storage.test.ts
│   ├── use-intersection-observer.test.ts
│   ├── use-scroll-depth.test.ts
│   ├── use-scroll-trigger.test.ts
│   └── use-time-on-page.test.ts
├── components/
│   ├── ui/                     # UI component tests
│   │   ├── button.test.tsx
│   │   ├── input.test.tsx
│   │   ├── contact-form.test.tsx
│   │   └── hero-section.test.tsx
│   └── cro/                    # CRO component tests
│       ├── exit-intent.test.tsx
│       ├── multi-step-form.test.tsx
│       └── countdown-timer.test.tsx
└── integration/                # Integration tests
    ├── form-submission.test.tsx
    ├── analytics-tracking.test.tsx
    └── theme-switching.test.tsx
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once (CI mode)
npm run test:ci

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/test/hooks/use-local-storage.test.ts

# Run tests matching a pattern
npm test -- --grep "ContactForm"
```

### Test Configuration

The project uses Vitest with the following configuration (`vitest.config.ts`):

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Test Utilities

### Custom Render Function

All tests use a custom render function that provides necessary providers:

```typescript
import { render, screen, fireEvent } from '../test-utils'

// Instead of direct React Testing Library import
const customRender = (ui, options) => 
  render(ui, { wrapper: AllTheProviders, ...options })
```

### Mock Utilities

#### Analytics Mocking
```typescript
import { mockAnalytics } from '../test-utils'

// All analytics functions are mocked
expect(mockAnalytics.trackEvent).toHaveBeenCalledWith({
  action: 'button_click',
  category: 'interactions',
  label: 'test-button'
})
```

#### LocalStorage Mocking
```typescript
import { mockLocalStorage } from '../test-utils'

const localStorageMock = mockLocalStorage()
localStorageMock.getItem.mockReturnValue(JSON.stringify('saved-value'))
```

#### Window Properties Mocking
```typescript
import { mockWindowProperties } from '../test-utils'

mockWindowProperties({
  pageYOffset: 100,
  innerHeight: 800,
  scrollHeight: 2000
})
```

### Helper Functions

```typescript
// Trigger scroll events
triggerScroll(scrollY)

// Trigger mouse leave for exit intent
triggerMouseLeave()

// Trigger visibility changes
triggerVisibilityChange(hidden)

// Async wait utility
await wait(1000)
```

## Test Categories

### Hook Tests

Custom hooks are tested using `renderHook` from React Testing Library:

```typescript
const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'))

act(() => {
  result.current[1]('newValue')
})

expect(result.current[0]).toBe('newValue')
```

**Key patterns:**
- Test initial state
- Test state updates with `act()`
- Test side effects (localStorage, event listeners)
- Test cleanup on unmount
- Test error scenarios

### Component Tests

Components are tested with full user interaction simulation:

```typescript
render(<ContactForm />)

fireEvent.change(screen.getByLabelText(/email/i), { 
  target: { value: 'test@example.com' } 
})
fireEvent.click(screen.getByRole('button', { name: /submit/i }))

await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

**Key patterns:**
- Test rendering with various props
- Test user interactions (clicks, typing, form submission)
- Test accessibility attributes
- Test error states and validation
- Test loading states

### Integration Tests

Integration tests verify complete user flows:

```typescript
// Form submission flow
render(<ContactForm />)
// Fill form
// Submit
// Verify success state
// Verify localStorage clearing
// Verify analytics tracking
```

**Key patterns:**
- Test complete user journeys
- Test cross-component interactions
- Test state management
- Test analytics integration
- Test theme consistency

## Testing Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad:**
```typescript
expect(component.state.isLoading).toBe(true)
```

✅ **Good:**
```typescript
expect(screen.getByText('Loading...')).toBeInTheDocument()
```

### 2. Use Semantic Queries

Prefer queries that match how users interact:

```typescript
// Good - semantic and accessible
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email address/i)

// Avoid - fragile and not semantic
screen.getByTestId('submit-btn')
screen.getByClassName('email-input')
```

### 3. Test Accessibility

Ensure tests verify accessibility:

```typescript
expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true')
expect(screen.getByRole('alert')).toBeInTheDocument()
```

### 4. Mock External Dependencies

Always mock:
- API calls
- Analytics tracking
- LocalStorage
- Browser APIs (IntersectionObserver, etc.)
- Third-party libraries

### 5. Test Error States

```typescript
// Mock API failure
mockSubmit.mockRejectedValue(new Error('Network error'))

// Verify error handling
await waitFor(() => {
  expect(screen.getByText(/error occurred/i)).toBeInTheDocument()
})
```

## Writing New Tests

### 1. Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react'
import { useYourHook } from '@/hooks/use-your-hook'

describe('useYourHook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useYourHook())
    expect(result.current.value).toBe('default')
  })

  it('should update value', () => {
    const { result } = renderHook(() => useYourHook())
    
    act(() => {
      result.current.setValue('newValue')
    })
    
    expect(result.current.value).toBe('newValue')
  })

  it('should cleanup on unmount', () => {
    const spy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useYourHook())
    
    unmount()
    
    expect(spy).toHaveBeenCalled()
  })
})
```

### 2. Component Tests

```typescript
import { render, screen, fireEvent } from '../../test-utils'
import { YourComponent } from '@/components/your-component'

describe('YourComponent', () => {
  it('should render with default props', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const mockOnClick = vi.fn()
    render(<YourComponent onClick={mockOnClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
```

### 3. Integration Tests

```typescript
describe('Feature Integration', () => {
  beforeEach(() => {
    // Setup mocks
    vi.clearAllMocks()
  })

  it('should complete full user flow', async () => {
    render(<CompleteFeature />)
    
    // Step 1: Initial interaction
    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    
    // Step 2: Fill form
    fireEvent.change(screen.getByLabelText(/input/i), { 
      target: { value: 'test' } 
    })
    
    // Step 3: Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    // Verify complete flow
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })
})
```

## Debugging Tests

### 1. Use screen.debug()

```typescript
render(<Component />)
screen.debug() // Prints current DOM
```

### 2. Use logRoles

```typescript
import { logRoles } from '@testing-library/dom'

render(<Component />)
logRoles(container) // Shows available roles
```

### 3. Check Act Warnings

If you see "act" warnings, wrap state updates:

```typescript
await act(async () => {
  fireEvent.click(button)
})
```

## Maintenance

### Regular Tasks

1. **Update snapshots** (if using): `npm test -- -u`
2. **Check coverage**: `npm test -- --coverage`
3. **Update mocks** when dependencies change
4. **Review and refactor** slow or flaky tests

### When Adding New Features

1. Write tests for new hooks
2. Test new components thoroughly
3. Add integration tests for new user flows
4. Update test utilities if needed
5. Verify coverage doesn't decrease

### Common Issues

#### Framer Motion Warnings
Mock framer-motion in tests:
```typescript
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}))
```

#### Timer/Async Issues
Use fake timers:
```typescript
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})
```

#### Event Listener Cleanup
Always verify cleanup:
```typescript
const spy = vi.spyOn(window, 'removeEventListener')
const { unmount } = render(<Component />)
unmount()
expect(spy).toHaveBeenCalled()
```

## Coverage Goals

Aim for:
- **Lines**: >90%
- **Functions**: >90%
- **Branches**: >85%
- **Statements**: >90%

Priority areas for 100% coverage:
- Utility functions
- Custom hooks
- Critical business logic
- Form validation

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Release builds

CI configuration runs:
```bash
npm run test:ci
npm run lint
npm run typecheck
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

1. Check existing tests for similar patterns
2. Review test-utils.tsx for available helpers
3. Consult React Testing Library documentation
4. Ask team members for complex scenarios

Remember: Good tests are documentation of how your code should behave. Write tests that make sense to future developers (including yourself)!