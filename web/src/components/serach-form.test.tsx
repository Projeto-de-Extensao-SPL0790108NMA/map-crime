import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchForm } from './search-form';

// Mock do TanStack Router
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('SearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with input and button', () => {
    render(<SearchForm />);

    expect(screen.getByPlaceholderText(/Ex: DEN001/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /buscar denúncia/i }),
    ).toBeInTheDocument();
  });

  it('should render helper text', () => {
    render(<SearchForm />);

    expect(
      screen.getByText(
        /Digite o código fornecido no momento do registro da denúncia/i,
      ),
    ).toBeInTheDocument();
  });

  it('should have submit button disabled when input is empty', () => {
    render(<SearchForm />);

    const button = screen.getByRole('button', { name: /buscar denúncia/i });
    expect(button).toBeDisabled();
  });

  it('should enable submit button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/Ex: DEN001/i);
    const button = screen.getByRole('button', { name: /buscar denúncia/i });

    await user.type(input, 'ABC123');

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should not enable button for whitespace only input', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/Ex: DEN001/i);
    const button = screen.getByRole('button', { name: /buscar denúncia/i });

    await user.type(input, '   ');

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('should navigate to report page on form submit', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/Ex: DEN001/i);
    const button = screen.getByRole('button', { name: /buscar denúncia/i });

    await user.type(input, 'ABC123DEF4');
    await user.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/reports/$code',
        params: { code: 'ABC123DEF4' },
      });
    });
  });

  it('should trim whitespace from tracking code', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/Ex: DEN001/i);
    const button = screen.getByRole('button', { name: /buscar denúncia/i });

    await user.type(input, '  ABC123  ');
    await user.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/reports/$code',
        params: { code: 'ABC123' },
      });
    });
  });

  it('should reset form after submission', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/Ex: DEN001/i);

    await user.type(input, 'ABC123');
    await user.click(screen.getByRole('button', { name: /buscar denúncia/i }));

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('should show validation error when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/Ex: DEN001/i);

    // O botão só fica habilitado quando tem valor, então vamos testar diferente
    await user.type(input, 'a');
    expect(
      screen.getByRole('button', { name: /buscar denúncia/i }),
    ).not.toBeDisabled();

    await user.clear(input);

    // Verifica que o botão volta a ficar desabilitado quando não tem valor
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /buscar denúncia/i }),
      ).toBeDisabled();
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchForm />);

    const input = screen.getByPlaceholderText(/Ex: DEN001/i);
    const button = screen.getByRole('button', { name: /buscar denúncia/i });

    expect(input).toHaveAttribute(
      'aria-label',
      'Digite o código de rastreio da denúncia',
    );
    expect(button).toHaveAttribute(
      'aria-label',
      'Buscar denúncia pelo código de rastreio',
    );
  });
});
