import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../TaskList';
import useTodoStore from '../../stores/todoStore';
import useAuthStore from '../../stores/authStore';

vi.mock('../../stores/todoStore');
vi.mock('../../stores/authStore');

describe('TaskList', () => {
  const mockUser = {
    id: 1,
    username: 'testuser'
  };

  const mockTodos = [
    { 
      id: 1, 
      name: 'High Priority Task', 
      priority: 'high', 
      completed_at: null,
      due_date: '2024-03-25',
      user_id: 1
    },
    { 
      id: 2, 
      name: 'Low Priority Task', 
      priority: 'low', 
      completed_at: '2024-03-19',
      due_date: '2024-03-20',
      user_id: 1
    }
  ];

  const mockStore = {
    todos: mockTodos,
    isLoading: false,
    error: null,
    fetchTodos: vi.fn(),
    completeTodo: vi.fn(),
    deleteTodo: vi.fn(),
    incompleteTodo: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTodoStore.mockReturnValue(mockStore);
    useAuthStore.mockReturnValue({ user: mockUser });
  });

  it('should not render tasks when user is not authenticated', () => {
    useAuthStore.mockReturnValue({ user: null });
    const { container } = render(<TaskList />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders todo items with correct badge colors based on priority', () => {
    render(<TaskList />);
    
    // Check for high priority badge
    const highPriorityBadge = screen.getByText('High').closest('.badge');
    expect(highPriorityBadge).toHaveClass('bg-danger');

    // Check for low priority badge
    const lowPriorityBadge = screen.getByText('Low').closest('.badge');
    expect(lowPriorityBadge).toHaveClass('bg-success');
  });

  it('shows completion status correctly', () => {
    render(<TaskList />);
    
    // Check incomplete task
    expect(screen.getByLabelText('Mark complete')).toBeInTheDocument();
    
    // Check completed task
    expect(screen.getByLabelText('Mark incomplete')).toBeInTheDocument();
  });

  it('handles todo actions', () => {
    render(<TaskList />);
    
    // Test complete action
    fireEvent.click(screen.getByLabelText('Mark complete'));
    expect(mockStore.completeTodo).toHaveBeenCalledWith(1);

    // Test delete action
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockStore.deleteTodo).toHaveBeenCalledWith(1);
  });

  it('fetches todos on mount', () => {
    render(<TaskList />);
    expect(mockStore.fetchTodos).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when loading', () => {
    useTodoStore.mockReturnValue({ ...mockStore, isLoading: true });
    render(<TaskList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    useTodoStore.mockReturnValue({ 
      ...mockStore, 
      error: 'Failed to load todos' 
    });
    render(<TaskList />);
    expect(screen.getByText('Error: Failed to load todos')).toBeInTheDocument();
  });
}); 