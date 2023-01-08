import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

describe('App', () => {
  test('renders welcome element', () => {
    render(<App />, { wrapper: BrowserRouter });
    const welcomeElement = screen.getByText(/Aprendamos mates/i);
    expect(welcomeElement).toBeInTheDocument();
  });
});
