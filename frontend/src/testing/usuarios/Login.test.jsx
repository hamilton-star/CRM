import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../components/usuarios/Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...original,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data: { nombre: 'Usuario Test' } }),
  });

  jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
  jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {});

  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

describe('Login component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('muestra el título Acceso de Usuario', () => {
    renderLogin();

    expect(
      screen.getByRole('heading', { name: /acceso de usuario/i })
    ).toBeInTheDocument();
  });

  test('permite enviar el formulario de login correctamente', async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
