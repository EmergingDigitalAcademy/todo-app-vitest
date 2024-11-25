import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskContainer from '../TaskContainer';

describe('TaskContainer', () => {
  it('renders TaskForm and TaskList components', () => {
    render(<TaskContainer />);
    expect(screen.getByText('Todo Manager')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });
}); 