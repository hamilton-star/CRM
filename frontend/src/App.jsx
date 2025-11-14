import React, { useState } from 'react';
import './styles.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Destinos from './components/Destinos/Destinos';
import Proveedores from './components/Proveedores/Proveedores';
import PaquetesTuristicos from './components/PaquetesTuristicos/PaquetesTuristicos';
import Clientes from './components/Clientes/clientes';
import Reservas from './components/reservas/Reservas';
import Comunicaciones from './components/Comunicaciones/Comunicaciones';
import Login from './components/usuarios/Login';

const App = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const [searchValue, setSearchValue] = useState('');

    

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
    };

    const reservations = [
        {
            id: '#RES-7842',
            client: 'María González',
            destination: 'París, Francia',
            date: '15/10/2023',
            people: '2',
            status: 'confirmada'
        },
        {
            id: '#RES-7841',
            client: 'Carlos Rodríguez',
            destination: 'Machu Picchu, Perú',
            date: '22/11/2023',
            people: '4',
            status: 'pendiente'
        },
        {
            id: '#RES-7840',
            client: 'Ana Martínez',
            destination: 'Tokio, Japón',
            date: '05/12/2023',
            people: '3',
            status: 'confirmada'
        },
        {
            id: '#RES-7839',
            client: 'Javier López',
            destination: 'Roma, Italia',
            date: '18/09/2023',
            people: '2',
            status: 'cancelada'
        },
        {
            id: '#RES-7838',
            client: 'Laura Sánchez',
            destination: 'New York, USA',
            date: '30/10/2023',
            people: '5',
            status: 'confirmada'
        }
    ];

    const menuItems = [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', path: '/' },
        { id: 'destinations', icon: 'fas fa-map-marked-alt', label: 'Destinos', path: '/destinos' },
        { id: 'providers', icon: 'fas fa-handshake', label: 'Proveedores', path: '/proveedores' },
        { id: 'packages', icon: 'fas fa-suitcase-rolling', label: 'Paquetes Turísticos', path: '/PaquetesTuristicos' },
        { id: 'clients', icon: 'fas fa-user-friends', label: 'Clientes', path: '/clientes' },
        { id: 'reservations', icon: 'fas fa-calendar-check', label: 'Reservas', path: '/reservas' },
        { id: 'payments', icon: 'fas fa-credit-card', label: 'Pagos', path: '/pagos' },
        { id: 'communication', icon: 'fas fa-comments', label: 'Comunicación', path: '/comunicacion' },
        { id: 'settings', icon: 'fas fa-cog', label: 'Configuración', path: '/configuracion' }
    ];

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard menuItems={menuItems} sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} activeMenuItem={activeMenuItem} handleMenuItemClick={handleMenuItemClick} searchValue={searchValue} setSearchValue={setSearchValue} reservations={reservations} /></ProtectedRoute>} />
                <Route path="/destinos" element={<ProtectedRoute><Destinos /></ProtectedRoute>} />
                <Route path="/proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
                <Route path="/PaquetesTuristicos" element={<ProtectedRoute><PaquetesTuristicos /></ProtectedRoute>} />
                <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
                <Route path="/reservas" element={<ProtectedRoute><Reservas /></ProtectedRoute>} />
                <Route path="/comunicacion" element={<ProtectedRoute><Comunicaciones /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

function Dashboard({ menuItems, sidebarCollapsed, toggleSidebar, activeMenuItem, handleMenuItemClick, searchValue, setSearchValue, reservations }) {
    const location = useLocation();
    const pathToId = {
        '/': 'dashboard',
        '/destinos': 'destinations',
        '/proveedores': 'providers',
        '/PaquetesTuristicos': 'packages',
        '/clientes': 'clients',
        '/reservas': 'reservations',
        '/comunicacion': 'communication',
        '/configuracion': 'settings'
    };
    const activeFromPath = pathToId[location.pathname] || 'dashboard';
    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="logo-container">
                    <div className="logo">
                        <i className="fas fa-globe-americas"></i>
                        <span className="logo-text">TurismoCRM</span>
                    </div>
                </div>
                <div className="sidebar-menu">
                    {menuItems.map(item => (
                        <Link 
                            key={item.id}
                            to={item.path}
                            className={`menu-item ${(activeMenuItem === item.id || activeFromPath === item.id) ? 'active' : ''}`}
                            onClick={() => handleMenuItemClick(item.id)}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <i className={item.icon}></i>
                            <span className="menu-text">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="header">
                    <div className="header-left">
                        <div className="toggle-sidebar" onClick={toggleSidebar}>
                            <i className="fas fa-bars"></i>
                        </div>
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="notification">
                            <i className="fas fa-bell"></i>
                            <div className="notification-badge">3</div>
                        </div>
                        <div className="user-profile">
                            <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Usuario" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="content">
                    <h1 className="page-title">
                        <i className="fas fa-tachometer-alt"></i>
                        Dashboard
                    </h1>

                    {/* Dashboard Cards */}
                    <div className="dashboard-cards">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Reservas del Mes</div>
                                <div className="card-icon reservas">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                            </div>
                            <div className="card-value">142</div>
                            <div className="card-footer positive">
                                <i className="fas fa-arrow-up"></i>
                                12% más que el mes anterior
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Clientes Activos</div>
                                <div className="card-icon clientes">
                                    <i className="fas fa-user-friends"></i>
                                </div>
                            </div>
                            <div className="card-value">856</div>
                            <div className="card-footer positive">
                                <i className="fas fa-arrow-up"></i>
                                5% más que el mes anterior
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Ingresos Totales</div>
                                <div className="card-icon pagos">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                            </div>
                            <div className="card-value">$42,580</div>
                            <div className="card-footer positive">
                                <i className="fas fa-arrow-up"></i>
                                18% más que el mes anterior
                            </div>
                        </div>
                        <Link to="/destinos" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card" style={{ cursor: 'pointer' }}>
                                <div className="card-header">
                                    <div className="card-title">Destinos Activos</div>
                                    <div className="card-icon destinos">
                                        <i className="fas fa-map-marked-alt"></i>
                                    </div>
                                </div>
                                <div className="card-value">24</div>
                                <div className="card-footer">
                                    <i className="fas fa-minus"></i>
                                    Sin cambios
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Charts */}
                    <div className="charts-container">
                        <div className="chart-card">
                            <div className="chart-header">
                                <div className="chart-title">Reservas por Mes</div>
                                <div className="chart-options">
                                    <select>
                                        <option>Últimos 6 meses</option>
                                        <option>Último año</option>
                                        <option>Últimos 2 años</option>
                                    </select>
                                </div>
                            </div>
                            <div className="chart-placeholder">
                                <i className="fas fa-chart-line" style={{ fontSize: '40px', marginRight: '10px' }}></i>
                                Gráfico de Reservas por Mes
                            </div>
                        </div>
                        <div className="chart-card">
                            <div className="chart-header">
                                <div className="chart-title">Destinos Populares</div>
                                <div className="chart-options">
                                    <select>
                                        <option>Este año</option>
                                        <option>Último año</option>
                                    </select>
                                </div>
                            </div>
                            <div className="chart-placeholder">
                                <i className="fas fa-chart-pie" style={{ fontSize: '40px', marginRight: '10px' }}></i>
                                Gráfico de Destinos Populares
                            </div>
                        </div>
                    </div>

                    {/* Recent Reservations Table */}
                    <div className="table-container">
                        <div className="table-header">
                            <div className="table-title">Reservas Recientes</div>
                            <div className="table-actions">
                                <button>
                                    <i className="fas fa-plus"></i> Nueva Reserva
                                </button>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Reserva</th>
                                    <th>Cliente</th>
                                    <th>Destino</th>
                                    <th>Fecha</th>
                                    <th>Personas</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((reservation) => (
                                    <tr key={reservation.id}>
                                        <td>{reservation.id}</td>
                                        <td>{reservation.client}</td>
                                        <td>{reservation.destination}</td>
                                        <td>{reservation.date}</td>
                                        <td>{reservation.people}</td>
                                        <td>
                                            <span className={`status ${reservation.status}`}>
                                                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn"><i className="fas fa-eye"></i></button>
                                            <button className="action-btn"><i className="fas fa-edit"></i></button>
                                            <button className="action-btn"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;

function ProtectedRoute({ children }) {
    const isAuthenticated = (() => {
        try {
            const u = localStorage.getItem('usuario');
            return !!u;
        } catch {
            return false;
        }
    })();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}
