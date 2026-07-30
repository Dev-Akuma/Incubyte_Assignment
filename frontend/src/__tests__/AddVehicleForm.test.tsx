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

        render(<AddVehicleForm />);

        // Fill out inputs
        fireEvent.change(screen.getByPlaceholderText('Make'), { target: { value: 'Honda' } });
        fireEvent.change(screen.getByPlaceholderText('Model'), { target: { value: 'Civic' } });
        fireEvent.change(screen.getByPlaceholderText('Year'), { target: { value: '2024' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '25000' } });
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '5' } });

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
                body: JSON.stringify({ make: 'Honda', model: 'Civic', year: 2024, price: 25000, quantity: 5 })
            }));
        });
        
        getItemSpy.mockRestore();
    });
});
