import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Clientes from '../../components/Clientes/Clientes';

// Helper para renderizar el componente envuelto en Router
const renderClientes = () => {
  return render(
    <MemoryRouter>
      <Clientes />
    </MemoryRouter>
  );
};

describe('Clientes component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('muestra el título principal de la página', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    renderClientes();

    expect(
      screen.getByRole('heading', { name: /gestión de clientes/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  test('carga y muestra la lista de clientes desde la API', async () => {
    const mockClientes = [
      {
        cliente_id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '123456789',
        documento_identidad: 'DNI-1',
        nacionalidad: 'argentina',
        fecha_registro: '2024-01-01',
        activo: true,
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockClientes }),
    });

    renderClientes();

    // Espera a que aparezca el nombre del cliente en la tabla
    expect(await screen.findByText(/juan pérez/i)).toBeInTheDocument();

    // Verifica que también se muestre el email y el teléfono
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
  });

  test('muestra un mensaje de error cuando la API falla', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: 'Error desde API' }),
    });

    renderClientes();

    expect(
      await screen.findByText(/error desde api/i)
    ).toBeInTheDocument();
  });
});
