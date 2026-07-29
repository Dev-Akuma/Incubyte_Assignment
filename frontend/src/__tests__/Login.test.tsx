import { render, screen } from '@testing-library/react';
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
});
