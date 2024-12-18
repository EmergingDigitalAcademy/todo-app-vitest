import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../TaskForm';
import useTodoStore from '../../stores/todoStore';
import useAuthStore from '../../stores/authStore';

vi.mock('../../stores/todoStore');
vi.mock('../../stores/authStore');

describe('TaskForm Component', () => {
  const mockUser = {
    id: 1,
    username: 'testuser'
  };

  const mockStore = {
    addTodo: vi.fn(),
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTodoStore.mockReturnValue(mockStore);
    useAuthStore.mockReturnValue({ user: mockUser });
  });

  it('should render form with all inputs', () => {
    render(<TaskForm />);
    
    // Check for all form elements
    expect(screen.getByPlaceholderText('Task name')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Low' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'High' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  it('should update form fields when user types', () => {
    render(<TaskForm />);
    
    const nameInput = screen.getByPlaceholderText('Task name');
    const prioritySelect = screen.getByRole('combobox');
    const dateInput = screen.getByRole('date');

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: 'New Task' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(dateInput, { target: { value: '2024-03-21' } });

    // Check if inputs were updated
    expect(nameInput.value).toBe('New Task');
    expect(prioritySelect.value).toBe('high');
    expect(dateInput.value).toBe('2024-03-21');
  });

  it('should call addTodo with form data when submitted', async () => {
    render(<TaskForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Task name'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'high' }
    });
    fireEvent.change(screen.getByRole('date'), {
      target: { value: '2024-03-21' }
    });

    fireEvent.submit(screen.getByLabelText('Add todo form'));

    expect(mockStore.addTodo).toHaveBeenCalledWith({
      name: 'Test Task',
      priority: 'high',
      due_date: '2024-03-21'
    });
  });

  it('should reset form after successful submission', async () => {
    render(<TaskForm />);
    
    // Fill and submit form
    const nameInput = screen.getByPlaceholderText('Task name');
    fireEvent.change(nameInput, { target: { value: 'Test Task' } });
    fireEvent.submit(screen.getByLabelText('Add todo form'));

    // Verify form was reset
    expect(nameInput.value).toBe('');
    expect(screen.getByRole('combobox').value).toBe('medium');
  });

  it('should disable submit button when loading', () => {
    useTodoStore.mockReturnValue({
      ...mockStore,
      isLoading: true
    });
    
    render(<TaskForm />);
    const submitButton = screen.getByRole('button', { name: /Add Task/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show error message when present', () => {
    useTodoStore.mockReturnValue({
      ...mockStore,
      error: 'Test error'
    });
    
    render(<TaskForm />);
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('should not render form when user is not authenticated', () => {
    useAuthStore.mockReturnValue({ user: null });
    render(<TaskForm />);
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
}); 