import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import useAuthStore from './stores/authStore'

// Mock react-router-dom with all required components
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
    Routes: ({ children }) => children,
    Route: ({ path, element }) => element,
    Navigate: ({ to }) => {
      return <div data-testid="redirect" data-to={to}>
        Redirecting to {to}
      </div>;
    },
    useNavigate: () => vi.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

vi.mock('./stores/authStore')

describe('App', () => {
    const mockUser = {
        id: 1,
        username: 'testuser'
    }

    beforeEach(() => {
        vi.clearAllMocks()
        useAuthStore.mockReturnValue({
            user: null,
            checkAuth: vi.fn()
        })
    })

    it('should show login page when not authenticated', () => {
        render(<App />)
        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    })

    it('should show tasks when authenticated', () => {
        useAuthStore.mockReturnValue({
            user: mockUser,
            checkAuth: vi.fn()
        })
        render(<App />)
        expect(screen.getByText('Todo Manager')).toBeInTheDocument()
    })

    it('should redirect authenticated users away from login', () => {
        useAuthStore.mockReturnValue({
            user: mockUser,
            checkAuth: vi.fn()
        })
        render(<App />)
        
        // Get all redirects
        const redirects = screen.getAllByTestId('redirect');
        
        // Check that we have redirects
        expect(redirects.length).toBeGreaterThan(0);
        
        // Verify at least one redirect is going to /tasks
        const tasksRedirect = redirects.some(
          element => element.dataset.to === '/tasks'
        );
        expect(tasksRedirect).toBe(true);
    })
})
