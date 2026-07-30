import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component', () => {
    it('fetches and displays a list of vehicles', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, make: 'Honda', model: 'Civic', year: 2020 },
                    { id: 2, make: 'Toyota', model: 'Corolla', year: 2021 }
                ]),
            })
        ) as any;

        render(<Dashboard />);

        // Assert that a loading state is present initially
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Wait for the data to be rendered
        await waitFor(() => {
            expect(screen.getByText(/Honda/i)).toBeInTheDocument();
            expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
        });
    });

    it('sells a vehicle when the sell button is clicked', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: 1, make: 'Honda', model: 'Civic', year: 2020, quantity: 5, category: 'Sedan' }
            ])
        });

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/Honda/i)).toBeInTheDocument();
        });

        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true })
        });

        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-jwt-token');

        fireEvent.click(screen.getByRole('button', { name: /sell/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/vehicles/1/sale', expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer fake-jwt-token'
                },
                body: JSON.stringify({ quantity: 1 })
            }));
        });
        
        getItemSpy.mockRestore();
    });

    it('restocks a vehicle when the restock button is clicked', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: 1, make: 'Ford', model: 'Mustang', year: 2022, quantity: 2, category: 'Coupe' }
            ])
        });

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/Ford/i)).toBeInTheDocument();
        });

        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true })
        });

        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-jwt-token');

        fireEvent.click(screen.getByRole('button', { name: /restock/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/vehicles/1/restock', expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer fake-jwt-token'
                },
                body: JSON.stringify({ quantity: 1 })
            }));
        });
        
        getItemSpy.mockRestore();
    });
});
