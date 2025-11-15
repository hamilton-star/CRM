import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const Comunicaciones = () => {
    const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:5000';
    const [comunicaciones, setComunicaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [clientesList, setClientesList] = useState([]);

    const usuarios = {
        1: "Roberto Jiménez",
        2: "Sofia Hernández",
        3: "Miguel Ángel Torres"
    };

    const tiposInteraccion = {
        "llamada": { texto: "Llamada", icono: "fas fa-phone" },
        "email": { texto: "Email", icono: "fas fa-envelope" },
        "whatsapp": { texto: "WhatsApp", icono: "fab fa-whatsapp" },
        "presencial": { texto: "Presencial", icono: "fas fa-handshake" }
    };

    const [formData, setFormData] = useState({
        cliente_id: '',
        usuario_id: '',
        tipo_interaccion: '',
        fecha_hora: '',
        descripcion: ''
    });
    const [editandoId, setEditandoId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Cargar datos iniciales (comunicaciones y clientes), setear fecha por defecto, y usuario actual desde localStorage
    useEffect(() => {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());

        // Obtener usuario actual del localStorage
        try {
            if (typeof window !== 'undefined') {
                const raw = localStorage.getItem('usuario');
                if (raw) {
                    const u = JSON.parse(raw);
                    setUsuarioActual(u);
                    setFormData(prev => ({ ...prev, usuario_id: u.usuario_id ? String(u.usuario_id) : '', fecha_hora: ahora.toISOString().slice(0, 16) }));
                } else {
                    setFormData(prev => ({ ...prev, fecha_hora: ahora.toISOString().slice(0, 16) }));
                }
            } else {
                setFormData(prev => ({ ...prev, fecha_hora: ahora.toISOString().slice(0, 16) }));
            }
        } catch (e) {
            setFormData(prev => ({ ...prev, fecha_hora: ahora.toISOString().slice(0, 16) }));
        }
        cargarDatos();
    }, []);

    async function cargarComunicaciones() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/comunicaciones`);
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Error al cargar comunicaciones');
            setComunicaciones(json.data || []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }

    async function cargarDatos() {
        setLoading(true);
        setError('');
        try {
            const [resCom, resCli] = await Promise.all([
                fetch(`${API_BASE}/api/comunicaciones`),
                fetch(`${API_BASE}/api/clientes`)
            ]);
            const [jsonCom, jsonCli] = await Promise.all([resCom.json(), resCli.json()]);
            if (!resCom.ok || !jsonCom.success) throw new Error(jsonCom.message || 'Error al cargar comunicaciones');
            if (!resCli.ok || !jsonCli.success) throw new Error(jsonCli.message || 'Error al cargar clientes');
            setComunicaciones(jsonCom.data || []);
            setClientesList(jsonCli.data || []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }

    // Función para manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usuarioActual || !usuarioActual.usuario_id) {
            setError('Debe iniciar sesión para registrar comunicaciones.');
            return;
        }
        const payload = {
            cliente_id: parseInt(formData.cliente_id),
            usuario_id: parseInt(usuarioActual.usuario_id),
            tipo_interaccion: formData.tipo_interaccion,
            fecha_hora: formData.fecha_hora,
            descripcion: formData.descripcion
        };
        try {
            setError('');
            if (editandoId) {
                const res = await fetch(`${API_BASE}/api/comunicaciones/${editandoId}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.message || 'Error al actualizar interacción');
                setEditandoId(null);
            } else {
                const res = await fetch(`${API_BASE}/api/comunicaciones`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.message || 'Error al crear interacción');
            }
            await cargarDatos();
            resetForm();
        } catch (e) { setError(e.message); }
    };

    // Función para resetear el formulario
    const resetForm = () => {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        
        setFormData({
            cliente_id: '',
            usuario_id: usuarioActual && usuarioActual.usuario_id ? String(usuarioActual.usuario_id) : '',
            tipo_interaccion: '',
            fecha_hora: ahora.toISOString().slice(0, 16),
            descripcion: ''
        });
        setEditandoId(null);
    };

    // Función para formatear fecha y hora
    const formatearFechaHora = (fechaHora) => {
        if (!fechaHora) return 'N/A';
        const fecha = new Date(fechaHora);
        const opciones = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    // Función para editar una comunicación
    const editarComunicacion = (id) => {
        const comunicacion = comunicaciones.find(c => c.interaccion_id === id);
        if (comunicacion) {
            setFormData({
                cliente_id: comunicacion.cliente_id.toString(),
                usuario_id: (usuarioActual && usuarioActual.usuario_id ? String(usuarioActual.usuario_id) : ''),
                tipo_interaccion: comunicacion.tipo_interaccion,
                fecha_hora: comunicacion.fecha_hora.slice(0, 16), // Asegurar formato correcto
                descripcion: comunicacion.descripcion
            });
            setEditandoId(id);
            
            // Scroll al formulario
            document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Función para eliminar una comunicación
    const eliminarComunicacion = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar esta interacción?')) return;
        try {
            setError('');
            const res = await fetch(`${API_BASE}/api/comunicaciones/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Error al eliminar interacción');
            await cargarDatos();
        } catch (e) { setError(e.message); }
    };

    // Función para exportar datos
    const exportarDatos = () => {
        // Aquí iría la lógica para exportar los datos
        alert('Función de exportación en desarrollo');
    };

    return (
        <Layout activeMenu="Comunicación">
            <div className="content">
                <h1 className="page-title">
                    <i className="fas fa-comments"></i>
                    Gestión de Comunicaciones
                </h1>
                {error && (<div className="alert error">{error}</div>)}
                {loading && (<div className="loading">Cargando...</div>)}

                {/* Formulario de Comunicaciones */}
                <div className="form-container">
                    <h2 className="form-title">
                        <i className={editandoId ? "fas fa-edit" : "fas fa-plus-circle"}></i>
                        {editandoId ? 'Editar Interacción' : 'Registrar Nueva Interacción'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cliente_id">Cliente *</label>
                                <select 
                                    id="cliente_id" 
                                    name="cliente_id" 
                                    value={formData.cliente_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un cliente</option>
                                    {clientesList.map(c => (
                                        <option key={`cliente-${c.cliente_id}`} value={c.cliente_id}>
                                            {`${c.nombre} ${c.apellido || ''}`.trim()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Agente</label>
                                <input type="text" readOnly value={usuarioActual?.nombre || 'No autenticado'} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo_interaccion">Tipo de Interacción *</label>
                                <select 
                                    id="tipo_interaccion" 
                                    name="tipo_interaccion" 
                                    value={formData.tipo_interaccion}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione tipo</option>
                                    <option value="llamada">Llamada Telefónica</option>
                                    <option value="email">Correo Electrónico</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="presencial">Reunión Presencial</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group datetime-input">
                                <label htmlFor="fecha_hora">Fecha y Hora *</label>
                                <input 
                                    type="datetime-local" 
                                    id="fecha_hora" 
                                    name="fecha_hora" 
                                    value={formData.fecha_hora}
                                    onChange={handleInputChange}
                                    required 
                                />
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label htmlFor="descripcion">Descripción de la Interacción *</label>
                                <textarea 
                                    id="descripcion" 
                                    name="descripcion" 
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Describa los detalles de la comunicación, temas tratados, acuerdos, seguimientos necesarios, etc..." 
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={resetForm}
                            >
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className={editandoId ? "fas fa-save" : "fas fa-save"}></i> 
                                {editandoId ? 'Actualizar Interacción' : 'Guardar Interacción'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de Comunicaciones */}
                <div className="table-container">
                    <div className="table-header">
                        <div className="table-title">Historial de Comunicaciones</div>
                        <div className="table-actions">
                            <button onClick={exportarDatos}>
                                <i className="fas fa-file-export"></i> Exportar
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Interacción</th>
                                <th>Tipo</th>
                                <th>Agente</th>
                                <th>Fecha y Hora</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...comunicaciones]
                                .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
                                .map(comunicacion => (
                                    <tr key={comunicacion.interaccion_id}>
                                        <td>#{comunicacion.interaccion_id.toString().padStart(3, '0')}</td>
                                        <td>
                                            <div className="interaction-info">
                                                <span className="interaction-client">{comunicacion.cliente_nombre || (clientesList.find(c => c.cliente_id === comunicacion.cliente_id) ? `${clientesList.find(c => c.cliente_id === comunicacion.cliente_id).nombre} ${clientesList.find(c => c.cliente_id === comunicacion.cliente_id).apellido || ''}`.trim() : 'Cliente desconocido')}</span>
                                                <span className="interaction-desc" title={comunicacion.descripcion}>
                                                    {comunicacion.descripcion}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`interaction-type ${comunicacion.tipo_interaccion}`}>
                                                <i className={tiposInteraccion[comunicacion.tipo_interaccion]?.icono || 'fas fa-question'}></i>
                                                {tiposInteraccion[comunicacion.tipo_interaccion]?.texto || comunicacion.tipo_interaccion}
                                            </span>
                                        </td>
                                        <td>{comunicacion.usuario_nombre || usuarios[comunicacion.usuario_id] || 'Usuario desconocido'}</td>
                                        <td>
                                            <div className="interaction-datetime">
                                                {formatearFechaHora(comunicacion.fecha_hora)}
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                className="action-btn editar" 
                                                onClick={() => editarComunicacion(comunicacion.interaccion_id)}
                                            >
                                                <i className="fas fa-edit"></i> Editar
                                            </button>
                                            <button 
                                                className="action-btn delete" 
                                                onClick={() => eliminarComunicacion(comunicacion.interaccion_id)}
                                            >
                                                <i className="fas fa-trash"></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Comunicaciones;
