import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaquetesTuristicos from '../../components/PaquetesTuristicos/PaquetesTuristicos';

const renderPaquetes = () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data: [] }),
  });

  return render(
    <MemoryRouter>
      <PaquetesTuristicos />
    </MemoryRouter>
  );
};

describe('PaquetesTuristicos component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('muestra el título Gestión de Paquetes Turísticos', async () => {
    renderPaquetes();

    expect(
      await screen.findByRole('heading', { name: /gestión de paquetes turísticos/i })
    ).toBeInTheDocument();
  });

  test('renderiza la tabla de catálogo de paquetes turísticos', async () => {
    renderPaquetes();

    expect(
      await screen.findByText(/catálogo de paquetes turísticos/i)
    ).toBeInTheDocument();
  });
});
