import React, { useState, useEffect } from 'react';
import './styles.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Destinos from './components/Destinos/Destinos';
import Proveedores from './components/Proveedores/Proveedores';
import PaquetesTuristicos from './components/PaquetesTuristicos/PaquetesTuristicos';
import Clientes from './components/Clientes/clientes';
import Reservas from './components/reservas/Reservas';
import Comunicaciones from './components/Comunicaciones/Comunicaciones';
import Login from './components/usuarios/Login';

const App = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try { return localStorage.getItem('sidebarCollapsed') === 'true'; } catch { return false; }
    });
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const [searchValue, setSearchValue] = useState('');

    

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => {
            const next = !prev;
            try { localStorage.setItem('sidebarCollapsed', next ? 'true' : 'false'); } catch {}
            return next;
        });
    };

    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
    };

    

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
                <Route path="/" element={<ProtectedRoute><Dashboard menuItems={menuItems} sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} activeMenuItem={activeMenuItem} handleMenuItemClick={handleMenuItemClick} searchValue={searchValue} setSearchValue={setSearchValue} /></ProtectedRoute>} />
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

function Dashboard({ menuItems, sidebarCollapsed, toggleSidebar, activeMenuItem, handleMenuItemClick, searchValue, setSearchValue }) {
    const location = useLocation();
    const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:5000';
    const [reservas, setReservas] = useState([]);
    const [clientesList, setClientesList] = useState([]);
    const [paquetesList, setPaquetesList] = useState([]);
    const [usuariosList, setUsuariosList] = useState([]);
    const [destinosList, setDestinosList] = useState([]);
    const [resError, setResError] = useState('');
    const [resLoading, setResLoading] = useState(false);
    useEffect(() => {
        let mounted = true;
        async function cargar() {
            setResLoading(true);
            setResError('');
            try {
                const [r, c, p, u, d] = await Promise.all([
                    axios.get(`${API_BASE}/api/reservas`),
                    axios.get(`${API_BASE}/api/clientes`),
                    axios.get(`${API_BASE}/api/paquetes`),
                    axios.get(`${API_BASE}/api/usuarios`),
                    axios.get(`${API_BASE}/api/destinos`)
                ]);

                const jr = r.data || {};
                const jc = c.data || {};
                const jp = p.data || {};
                const ju = u.data || {};
                const jd = d.data || {};

                if (!jr.success) throw new Error(jr.message || 'Error al cargar reservas');
                if (!jc.success) throw new Error(jc.message || 'Error al cargar clientes');
                if (!jp.success) throw new Error(jp.message || 'Error al cargar paquetes');
                if (!ju.success) throw new Error(ju.message || 'Error al cargar usuarios');
                if (!jd.success) throw new Error(jd.message || 'Error al cargar destinos');
                if (!mounted) return;
                setReservas(jr.data || []);
                setClientesList(jc.data || []);
                setPaquetesList(jp.data || []);
                setUsuariosList(ju.data || []);
                setDestinosList(jd.data || []);
            } catch (e) {
                setResError(e.message);
            } finally {
                setResLoading(false);
            }
        }
        cargar();
        return () => { mounted = false; };
    }, []);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const reservasDelMes = (reservas || []).filter((reserva) => {
        const fechaBase = reserva.fecha_reserva || reserva.fecha_salida;
        if (!fechaBase) return false;
        const fecha = new Date(fechaBase);
        return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    }).length;

    const clientesActivos = (() => {
        const lista = clientesList || [];
        const filtrados = lista.filter((c) =>
            c.activo === true ||
            c.activo === 1 ||
            c.activo === 'true' ||
            c.estado === 'activo'
        );
        return filtrados.length || lista.length;
    })();

    const ingresosTotales = (reservas || []).reduce((total, reserva) => {
        return total + Number(reserva.precio_total || 0);
    }, 0);

    const totalDestinos = (destinosList || []).length;

    // Reservas por mes: contamos cuántas reservas hay en cada mes (según fecha_reserva o fecha_salida)
    const mapaReservasPorMes = {};
    (reservas || []).forEach((reserva) => {
        const fechaBase = reserva.fecha_reserva || reserva.fecha_salida;
        if (!fechaBase) return;
        const fecha = new Date(fechaBase);
        if (Number.isNaN(fecha.getTime())) return;
        const year = fecha.getFullYear();
        const month = fecha.getMonth(); // 0-11
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;
        if (!mapaReservasPorMes[key]) {
            const label = fecha.toLocaleDateString('es-ES', { month: 'short' });
            mapaReservasPorMes[key] = { label, year, month, count: 0 };
        }
        mapaReservasPorMes[key].count += 1;
    });

    const reservasPopulares = Object.values(mapaReservasPorMes)
        .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year));

    // Destinos populares: contamos cuántas veces se ha reservado cada destino
    const mapaDestinosPopulares = {};
    (reservas || []).forEach((reserva) => {
        const destinoNombre =
            reserva.destino_nombre ||
            reserva.destino ||
            (paquetesList || []).find((p) => p.paquete_id === reserva.paquete_id)?.destino ||
            'Sin destino';
        const key = String(destinoNombre);
        if (!mapaDestinosPopulares[key]) {
            mapaDestinosPopulares[key] = 0;
        }
        mapaDestinosPopulares[key] += 1;
    });

    const destinosPopulares = Object.entries(mapaDestinosPopulares)
        .sort((a, b) => b[1] - a[1])
        .map(([nombre, count]) => ({ nombre, count }));
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
    useEffect(() => {
        try {
            const fromLS = localStorage.getItem('sidebarCollapsed') === 'true';
            if (fromLS !== sidebarCollapsed) toggleSidebar();
        } catch {}
        // eslint-disable-next-line
    }, []);
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
                            title={item.label}
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
                        <div className="toggle-sidebar" onClick={toggleSidebar} aria-label="Alternar sidebar">
                            <i className={sidebarCollapsed ? "fas fa-arrow-right" : "fas fa-arrow-left"}></i>
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
                            <div className="card-value">{reservasDelMes}</div>
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
                            <div className="card-value">{clientesActivos}</div>
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
                            <div className="card-value">${ingresosTotales.toFixed(2)}</div>
                            <div className="card-footer positive">
                                <i className="fas fa-arrow-up"></i>
                                18% más que el mes anterior
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Destinos Activos</div>
                                <div className="card-icon destinos">
                                    <i className="fas fa-map-marked-alt"></i>
                                </div>
                            </div>
                            <div className="card-value">{totalDestinos}</div>
                            <div className="card-footer">
                                <i className="fas fa-minus"></i>
                                Sin cambios
                            </div>
                        </div>
                    </div>
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
                            <div className="chart-content">
                                {reservasPopulares.length === 0 ? (
                                    <div className="chart-placeholder">
                                        <i className="fas fa-chart-line" style={{ fontSize: '40px', marginRight: '10px' }}></i>
                                        Gráfico de Reservas por Mes
                                    </div>
                                ) : (
                                    (() => {
                                        const maxCount = Math.max(...reservasPopulares.map((r) => r.count), 1);
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px' }}>
                                                {reservasPopulares.map((item) => (
                                                    <div key={`${item.year}-${item.month}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0' }}>
                                                        <div
                                                            style={{
                                                                width: '60%',
                                                                backgroundColor: '#4f46e5',
                                                                borderRadius: '6px 6px 0 0',
                                                                height: `${(item.count / maxCount) * 100}%`,
                                                                minHeight: item.count > 0 ? '8px' : '0',
                                                                transition: 'height 0.3s ease'
                                                            }}
                                                        ></div>
                                                        <span style={{ fontSize: '11px', marginTop: '4px', textTransform: 'capitalize' }}>{item.label}</span>
                                                        <span style={{ fontSize: '11px', color: '#6b7280' }}>{item.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()
                                )}
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
                            <div className="chart-content">
                                {destinosPopulares.length === 0 ? (
                                    <div className="chart-placeholder">
                                        <i className="fas fa-chart-pie" style={{ fontSize: '40px', marginRight: '10px' }}></i>
                                        Gráfico de Destinos Populares
                                    </div>
                                ) : (
                                    (() => {
                                        const maxCount = Math.max(...destinosPopulares.map((d) => d.count), 1);
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', overflowX: 'auto', paddingBottom: '4px' }}>
                                                {destinosPopulares.map((item) => (
                                                    <div key={item.nombre} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
                                                        <div
                                                            style={{
                                                                width: '60%',
                                                                backgroundColor: '#10b981',
                                                                borderRadius: '6px 6px 0 0',
                                                                height: `${(item.count / maxCount) * 100}%`,
                                                                minHeight: item.count > 0 ? '8px' : '0',
                                                                transition: 'height 0.3s ease'
                                                            }}
                                                        ></div>
                                                        <span style={{ fontSize: '11px', marginTop: '4px', textAlign: 'center', textTransform: 'capitalize' }}>{item.nombre}</span>
                                                        <span style={{ fontSize: '11px', color: '#6b7280' }}>{item.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </div>

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
                                    <th>ID</th>
                                    <th>Reserva</th>
                                    <th>Fechas</th>
                                    <th>Agente</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(resLoading || resError) ? (
                                    []
                                ) : (
                                    (reservas || []).slice(0, 8).map(reserva => (
                                        <tr key={reserva.reserva_id}>
                                            <td>#{reserva.reserva_id?.toString().padStart(3, '0')}</td>
                                            <td>
                                                <div className="reserva-info">
                                                    <span className="reserva-cliente">{reserva.cliente_nombre || (clientesList.find(c => c.cliente_id === reserva.cliente_id)?.nombre + ' ' + (clientesList.find(c => c.cliente_id === reserva.cliente_id)?.apellido || ''))}</span>
                                                    <span className="reserva-paquete">{reserva.nombre_paquete || (paquetesList.find(p => p.paquete_id === reserva.paquete_id)?.nombre_paquete)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="reserva-info">
                                                    <span className="reserva-fechas">Salida: {new Date(reserva.fecha_salida).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                    <span className="reserva-fechas">Retorno: {new Date(reserva.fecha_retorno).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td>{reserva.usuario_nombre || (usuariosList.find(u => u.usuario_id === reserva.usuario_id)?.nombre)}</td>
                                            <td className="price">${Number(reserva.precio_total || 0).toFixed(2)}</td>
                                            <td>
                                                <span className={`status ${reserva.estado}`}>{reserva.estado?.charAt(0).toUpperCase() + reserva.estado?.slice(1)}</span>
                                            </td>
                                            <td>
                                                <button className="action-btn"><i className="fas fa-eye"></i></button>
                                                <button className="action-btn"><i className="fas fa-edit"></i></button>
                                                <button className="action-btn"><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {resError && <div className="alert error">{resError}</div>}
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
