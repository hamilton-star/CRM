import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const menuItems = [
  { icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
  { icon: 'fas fa-map-marked-alt', label: 'Destinos' },
  { icon: 'fas fa-handshake', label: 'Proveedores' },
  { icon: 'fas fa-users', label: 'Usuarios' },
  { icon: 'fas fa-suitcase-rolling', label: 'Paquetes Turísticos' },
  { icon: 'fas fa-user-friends', label: 'Clientes' },
  { icon: 'fas fa-calendar-check', label: 'Reservas' },
  { icon: 'fas fa-credit-card', label: 'Pagos' },
  { icon: 'fas fa-comments', label: 'Comunicación' },
  { icon: 'fas fa-cog', label: 'Configuración' },
];

const pathByLabel = {
  'Dashboard': '/',
  'Destinos': '/destinos',
  'Proveedores': '/proveedores',
  'Usuarios': '/login',
  'Paquetes Turísticos': '/PaquetesTuristicos',
  'Clientes': '/clientes',
  'Reservas': '/reservas',
  'Pagos': '/pagos',
  'Comunicación': '/comunicacion',
  'Configuración': '/configuracion',
};

export default function Layout({ children, activeMenu = 'Destinos' }) {
  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <i className="fas fa-globe-americas"></i>
            <span className="logo-text">TurismoCRM</span>
          </div>
        </div>
        <div className="sidebar-menu">
          {menuItems.map(item => (
            <Link
              key={item.label}
              to={pathByLabel[item.label] || '/'}
              className={`menu-item${item.label === activeMenu ? ' active' : ''}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <i className={item.icon}></i>
              <span className="menu-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
