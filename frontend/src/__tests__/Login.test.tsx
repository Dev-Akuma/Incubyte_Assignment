import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';

describe('Login Component', () => {
    it('renders login form with email and password fields', () => {
        render(<Login />);

        // Assert email input exists
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

        // Assert password input exists
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

        // Assert login button exists
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('submits credentials to the API on button click', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'fake-token' }),
            })
        ) as any;

        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
            }));
        });
    });
});
