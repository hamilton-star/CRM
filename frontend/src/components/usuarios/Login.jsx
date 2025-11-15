import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:5000';
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // si ya está autenticado, redirigir al dashboard
    try {
      if (typeof window !== 'undefined') {
        const u = localStorage.getItem('usuario');
        if (u) navigate('/', { replace: true });
      }
    } catch {}
  }, [navigate]);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error de autenticación');
      // Guardar usuario básico para uso posterior (ej. mostrar nombre en UI)
      if (typeof window !== 'undefined') {
        localStorage.setItem('usuario', JSON.stringify(json.data));
      }
      // eslint-disable-next-line no-alert
      alert(`¡Inicio de sesión exitoso!\nUsuario: ${json.data.nombre}`);
      navigate('/', { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-96 relative">
        {/* Avatar circular flotante */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 w-24 h-24 rounded-full flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-center mt-8 mb-6 text-gray-800">Acceso de Usuario</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Correo electrónico"
            className="w-full p-3 mb-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Contraseña"
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {/* Iconos ojo */}
              {!showPassword ? (
                // Ojo cerrado
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                // Ojo abierto
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-3">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Primera vez aquí? <span className="text-green-500 cursor-pointer font-semibold hover:underline">Crear cuenta</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
