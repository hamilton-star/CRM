import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reservas from '../../components/reservas/Reservas';

const renderReservas = () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data: [] }),
  });

  return render(
    <MemoryRouter>
      <Reservas />
    </MemoryRouter>
  );
};

describe('Reservas component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('muestra el título Gestión de Reservas', async () => {
    renderReservas();

    expect(
      await screen.findByRole('heading', { name: /gestión de reservas/i })
    ).toBeInTheDocument();
  });

  test('renderiza la tabla de lista de reservas', async () => {
    renderReservas();

    expect(await screen.findByText(/lista de reservas/i)).toBeInTheDocument();
  });
});
