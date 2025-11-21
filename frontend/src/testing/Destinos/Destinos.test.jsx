import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Destinos from '../../components/Destinos/Destinos';

const renderDestinos = () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data: [] }),
  });

  return render(
    <MemoryRouter>
      <Destinos />
    </MemoryRouter>
  );
};

describe('Destinos component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('muestra el título de Gestión de Destinos', async () => {
    renderDestinos();

    expect(
      await screen.findByRole('heading', { name: /gestión de destinos/i })
    ).toBeInTheDocument();
  });

  test('renderiza la tabla de lista de destinos', async () => {
    renderDestinos();

    expect(await screen.findByText(/lista de destinos/i)).toBeInTheDocument();
  });
});
