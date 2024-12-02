import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../TaskList';
import useTodoStore from '../../stores/todoStore';

vi.mock('../../stores/todoStore');

describe('TaskList', () => {
  const mockTodos = [
    { 
      id: 1, 
      name: 'Test Todo', 
      priority: 'high', 
      completed_at: null,
      due_date: '2024-03-25'
    },
    { 
      id: 2, 
      name: 'Completed Todo', 
      priority: 'low', 
      completed_at: '2024-03-19',
      due_date: '2024-03-20'
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
  });

  it('renders table with correct headers', () => {
    render(<TaskList />);
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders todo items with due dates', () => {
    render(<TaskList />);
    // Use a regex to match the date format
    expect(screen.getByText(/3\/25\/2024|3\/24\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/3\/20\/2024|3\/19\/2024/)).toBeInTheDocument();
  });

  it('applies correct styling for completed todos', () => {
    render(<TaskList />);
    const completedRow = screen.getByText('Completed Todo').closest('tr');
    expect(completedRow).toHaveClass('table-success');
  });

  it('toggles todo completion status', () => {
    render(<TaskList />);
    
    // Complete an incomplete todo
    const completeButton = screen.getByLabelText('Mark complete');
    fireEvent.click(completeButton);
    expect(mockStore.completeTodo).toHaveBeenCalledWith(1);

    // Incomplete a completed todo
    const incompleteButton = screen.getByLabelText('Mark incomplete');
    fireEvent.click(incompleteButton);
    expect(mockStore.incompleteTodo).toHaveBeenCalledWith(2);
  });

  it('shows correct completion icons', () => {
    render(<TaskList />);
    expect(screen.getByLabelText('Mark complete')).toBeInTheDocument();
    expect(screen.getByLabelText('Mark incomplete')).toBeInTheDocument();
  });

  it('handles delete action', () => {
    render(<TaskList />);
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
    useTodoStore.mockReturnValue({ ...mockStore, error: 'Failed to load todos' });
    render(<TaskList />);
    expect(screen.getByText('Error: Failed to load todos')).toBeInTheDocument();
  });

  it('renders todo items with correct badge colors based on priority', () => {
    render(<TaskList />);
    
    // Check for the badge of the high priority task
    const highPriorityBadge = screen.getByText('Test Todo').closest('tr').querySelector('td:nth-child(4) .badge');
    expect(highPriorityBadge).toHaveClass('bg-danger'); // Check if the badge has the correct class for high priority

    // Check for the badge of the low priority task
    const lowPriorityBadge = screen.getByText('Completed Todo').closest('tr').querySelector('td:nth-child(4) .badge');
    expect(lowPriorityBadge).toHaveClass('bg-success'); // Check if the badge has the correct class for low priority
  });
}); 