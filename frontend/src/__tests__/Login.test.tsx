import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as any,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    it('renders login form with username and password fields', () => {
        render(<MemoryRouter><Login /></MemoryRouter>);

        // Assert username input exists
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();

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

        render(<MemoryRouter><Login /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
                method: 'POST'
            }));
        });
    });

    it('displays error message on failed login', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 401,
                json: () => Promise.resolve({ detail: 'Incorrect username or password' }),
            })
        ) as any;

        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'baduser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText('Incorrect username or password')).toBeInTheDocument();
        });
    });

    it('saves token to localStorage on successful login', async () => {
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ access_token: 'fake-token-123' }),
            })
        ) as any;

        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(setItemSpy).toHaveBeenCalledWith('token', 'fake-token-123');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
        
        setItemSpy.mockRestore();
    });
});
