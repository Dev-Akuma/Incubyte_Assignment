import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
});
