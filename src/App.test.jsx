import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
    it('should render the TaskContainer', () => {
        render(<App />);
        expect(screen.getByText('Todo Manager')).toBeInTheDocument();
    });
})
