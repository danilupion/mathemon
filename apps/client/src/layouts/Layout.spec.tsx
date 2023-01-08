import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Layout from './Layout';

describe('Layout', function () {
  test('renders CookiesModal', () => {
    render(<Layout />, { wrapper: BrowserRouter });
    const cookiesModal = screen.getByTestId('cookies-modal');
    expect(cookiesModal).toBeInTheDocument();
  });
});
