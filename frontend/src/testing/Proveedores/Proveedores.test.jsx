import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Proveedores from '../../components/Proveedores/Proveedores';

const renderProveedores = () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data: [] }),
  });

  return render(
    <MemoryRouter>
      <Proveedores />
    </MemoryRouter>
  );
};

describe('Proveedores component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('muestra el título Gestión de Proveedores', async () => {
    renderProveedores();

    expect(
      await screen.findByRole('heading', { name: /gestión de proveedores/i })
    ).toBeInTheDocument();
  });

  test('renderiza la tabla de lista de proveedores', async () => {
    renderProveedores();

    expect(await screen.findByText(/lista de proveedores/i)).toBeInTheDocument();
  });
});
