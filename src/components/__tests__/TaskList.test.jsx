import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../TaskList';
import useTodoStore from '../../stores/todoStore';

// Tell Vitest to mock the entire todoStore module
// This replaces the real implementation with a mock function
vi.mock('../../stores/todoStore');

describe('TaskList', () => {
  // Mock data that represents what our store would normally return
  const mockTodos = [
    { id: 1, name: 'Test Todo', priority: 'high', completed_at: null },
    { id: 2, name: 'Completed Todo', priority: 'low', completed_at: '2024-03-19' }
  ];

  // Create a mock store object that matches the shape of our real store
  // but with vi.fn() mock functions for actions
  const mockStore = {
    todos: mockTodos,
    isLoading: false,
    error: null,
    fetchTodos: vi.fn(),    // Mock function for fetching todos
    completeTodo: vi.fn(),  // Mock function for completing todos
    deleteTodo: vi.fn()     // Mock function for deleting todos
  };

  // Before each test, reset the mock implementation
  // This ensures each test starts with a fresh mock
  beforeEach(() => {
    // When useTodoStore is called, return our mockStore
    useTodoStore.mockReturnValue(mockStore);
  });

  // Test cases...
  // Each test renders the component and asserts expected behavior
  it('renders todos list', () => {
    render(<TaskList />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Completed Todo')).toBeInTheDocument();
  });

  // Test interaction with complete button
  // Verifies that clicking calls the mock function with correct ID
  it('handles complete todo action', () => {
    render(<TaskList />);
    const completeButton = screen.getAllByRole('button', { name: /Complete/i })[0];
    fireEvent.click(completeButton);
    expect(mockStore.completeTodo).toHaveBeenCalledWith(1);
  });

  // Test interaction with delete button
  // Verifies that clicking calls the mock function with correct ID
  it('handles delete todo action', () => {
    render(<TaskList />);
    const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0];
    fireEvent.click(deleteButton);
    expect(mockStore.deleteTodo).toHaveBeenCalledWith(1);
  });

  // Test loading state by modifying mock store return value
  it('shows loading state', () => {
    useTodoStore.mockReturnValue({ ...mockStore, isLoading: true });
    render(<TaskList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // Test error state by modifying mock store return value
  it('shows error state', () => {
    useTodoStore.mockReturnValue({ ...mockStore, error: 'Test error' });
    render(<TaskList />);
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
}); 