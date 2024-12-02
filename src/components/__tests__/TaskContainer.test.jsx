import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskContainer from '../TaskContainer';
import useAuthStore from '../../stores/authStore';

// Mock the auth store
vi.mock('../../stores/authStore');

describe('TaskContainer', () => {
  const mockUser = {
    id: 1,
    username: 'testuser'
  };

  beforeEach(() => {
    // Set up authenticated user by default
    useAuthStore.mockReturnValue({
      user: mockUser,
      checkAuth: vi.fn()
    });
  });

  it('renders TaskForm and TaskList components when authenticated', () => {
    render(<TaskContainer />);
    expect(screen.getByText('Todo Manager')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  it('does not render components when not authenticated', () => {
    useAuthStore.mockReturnValue({
      user: null,
      checkAuth: vi.fn()
    });
    
    const { container } = render(<TaskContainer />);
    expect(container).toBeEmptyDOMElement();
  });
}); 