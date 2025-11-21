import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Comunicaciones from '../../components/Comunicaciones/Comunicaciones';

const renderComunicaciones = () => {
  // Mock localStorage usuario para evitar errores en useEffect
  const usuarioMock = { usuario_id: 1, nombre: 'Usuario Test' };
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
    if (key === 'usuario') return JSON.stringify(usuarioMock);
    return null;
  });

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data: [] }),
  });

  return render(
    <MemoryRouter>
      <Comunicaciones />
    </MemoryRouter>
  );
};

describe('Comunicaciones component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('muestra el título Gestión de Comunicaciones', async () => {
    renderComunicaciones();

    expect(
      await screen.findByRole('heading', { name: /gestión de comunicaciones/i })
    ).toBeInTheDocument();
  });

  test('renderiza la tabla de historial de comunicaciones', async () => {
    renderComunicaciones();

    expect(
      await screen.findByText(/historial de comunicaciones/i)
    ).toBeInTheDocument();
  });
});
