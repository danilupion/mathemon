import { fireEvent, render, screen } from '@testing-library/react';

import CookiesModal from './index';

describe('CookiesModal', function () {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render a dialog if terms where not previously accepted', () => {
    render(<CookiesModal />);
    const cookiesModal = screen.getByTestId('cookies-modal');
    expect(cookiesModal).toBeInTheDocument();
  });

  test('should not render a dialog if terms where not previously accepted', () => {
    localStorage.setItem('cookies-accepted', 'true');
    render(<CookiesModal />);
    const cookiesModal = screen.queryByTestId('cookies-modal');
    expect(cookiesModal).not.toBeInTheDocument();
  });

  test('should close the dialog when the accept button is clicked', () => {
    render(<CookiesModal />);
    const acceptButton = screen.getByText('Aceptar');
    const cookiesModalBeforeClick = screen.getByTestId('cookies-modal');
    expect(cookiesModalBeforeClick).toBeInTheDocument();
    fireEvent.click(acceptButton);
    const cookiesModalAfterClick = screen.queryByTestId('cookies-modal');
    expect(cookiesModalAfterClick).not.toBeInTheDocument();
  });
});
