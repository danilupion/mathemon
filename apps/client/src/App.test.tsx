import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

test('renders welcome element', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  const welcomeElement = screen.getByText(/Aprendamos mates/i);
  expect(welcomeElement).toBeInTheDocument();
});
