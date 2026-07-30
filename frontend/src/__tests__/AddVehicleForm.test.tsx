import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddVehicleForm from '../components/AddVehicleForm';

describe('AddVehicleForm Component', () => {
    it('submits new vehicle data to the API', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                status: 201,
                json: () => Promise.resolve({ id: 1, make: 'Honda', model: 'Civic', year: 2024, price: 25000, quantity: 5 }),
            })
        ) as any;

        // Mock localStorage token for the Authorization header
        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-jwt-token');

        render(<AddVehicleForm onVehicleAdded={() => {}} />);

        // Fill out inputs
        fireEvent.change(screen.getByPlaceholderText('Make'), { target: { value: 'Honda' } });
        fireEvent.change(screen.getByPlaceholderText('Model'), { target: { value: 'Civic' } });
        fireEvent.change(screen.getByPlaceholderText('Year'), { target: { value: '2024' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '25000' } });
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('Category'), { target: { value: 'Coupe' } });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith('/api/vehicles', expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer fake-jwt-token'
                },
                body: JSON.stringify({ make: 'Honda', model: 'Civic', year: 2024, price: 25000, quantity: 5, category: 'Coupe' })
            }));
        });
        
        getItemSpy.mockRestore();
    });

    it('displays error message on failed submission', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ detail: 'Validation error' }),
            })
        ) as any;

        render(<AddVehicleForm onVehicleAdded={() => {}} />);
        fireEvent.change(screen.getByPlaceholderText('Make'), { target: { value: 'Honda' } });
        fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

        await waitFor(() => {
            expect(screen.getByText(/Validation error/i)).toBeInTheDocument();
        });
    });

    it('clears form and calls onVehicleAdded callback on success', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                status: 201,
                json: () => Promise.resolve({ id: 1, make: 'Honda', model: 'Civic', year: 2024, price: 25000, quantity: 5 }),
            })
        ) as any;

        const mockOnAdded = vi.fn();
        render(<AddVehicleForm onVehicleAdded={mockOnAdded} />);

        fireEvent.change(screen.getByPlaceholderText('Make'), { target: { value: 'Honda' } });
        fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

        await waitFor(() => {
            expect(mockOnAdded).toHaveBeenCalledTimes(1);
            expect(screen.getByPlaceholderText('Make')).toHaveValue('');
        });
    });
});
