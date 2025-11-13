import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const Reservas = () => {
    const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:5000';
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Listas reales
    const [clientesList, setClientesList] = useState([]);
    const [paquetesList, setPaquetesList] = useState([]);
    const [usuariosList, setUsuariosList] = useState([]);

    // Estados del formulario
    const [formData, setFormData] = useState({
        cliente_id: '',
        paquete_id: '',
        usuario_id: '',
        fecha_reserva: new Date().toISOString().split('T')[0],
        fecha_salida: '',
        fecha_retorno: '',
        estado: '',
        precio_total: '',
        notas: ''
    });
    
    const [editandoId, setEditandoId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Manejar envío del formulario
    useEffect(() => { cargarTodo(); }, []);

    async function cargarTodo() {
        setLoading(true);
        setError('');
        try {
            const [resReservas, resClientes, resPaquetes, resUsuarios] = await Promise.all([
                fetch(`${API_BASE}/api/reservas`),
                fetch(`${API_BASE}/api/clientes`),
                fetch(`${API_BASE}/api/paquetes`),
                fetch(`${API_BASE}/api/usuarios`),
            ]);
            const [jsonReservas, jsonClientes, jsonPaquetes, jsonUsuarios] = await Promise.all([
                resReservas.json(), resClientes.json(), resPaquetes.json(), resUsuarios.json()
            ]);
            if (!resReservas.ok || !jsonReservas.success) throw new Error(jsonReservas.message || 'Error al cargar reservas');
            if (!resClientes.ok || !jsonClientes.success) throw new Error(jsonClientes.message || 'Error al cargar clientes');
            if (!resPaquetes.ok || !jsonPaquetes.success) throw new Error(jsonPaquetes.message || 'Error al cargar paquetes');
            if (!resUsuarios.ok || !jsonUsuarios.success) throw new Error(jsonUsuarios.message || 'Error al cargar usuarios');
            setReservas(jsonReservas.data || []);
            setClientesList(jsonClientes.data || []);
            setPaquetesList(jsonPaquetes.data || []);
            setUsuariosList(jsonUsuarios.data || []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            cliente_id: parseInt(formData.cliente_id),
            paquete_id: parseInt(formData.paquete_id),
            usuario_id: parseInt(formData.usuario_id),
            fecha_reserva: formData.fecha_reserva,
            fecha_salida: formData.fecha_salida,
            fecha_retorno: formData.fecha_retorno,
            estado: formData.estado,
            precio_total: parseFloat(formData.precio_total),
            notas: formData.notas
        };
        try {
            setError('');
            if (editandoId) {
                const res = await fetch(`${API_BASE}/api/reservas/${editandoId}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.message || 'Error al actualizar reserva');
                setEditandoId(null);
            } else {
                const res = await fetch(`${API_BASE}/api/reservas`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.message || 'Error al crear reserva');
            }
            await cargarTodo();
            setFormData({
                cliente_id: '', paquete_id: '', usuario_id: '', fecha_reserva: new Date().toISOString().split('T')[0], fecha_salida: '', fecha_retorno: '', estado: '', precio_total: '', notas: ''
            });
        } catch (e) { setError(e.message); }
    };

    // Editar reserva
    const editarReserva = (id) => {
        const reserva = reservas.find(r => r.reserva_id === id);
        if (reserva) {
            setFormData({
                cliente_id: reserva.cliente_id.toString(),
                paquete_id: reserva.paquete_id.toString(),
                usuario_id: reserva.usuario_id.toString(),
                fecha_reserva: reserva.fecha_reserva,
                fecha_salida: reserva.fecha_salida,
                fecha_retorno: reserva.fecha_retorno,
                estado: reserva.estado,
                precio_total: reserva.precio_total.toString(),
                notas: reserva.notas
            });
            setEditandoId(id);
        }
    };

    // Eliminar reserva
    const eliminarReserva = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar esta reserva?')) return;
        try {
            setError('');
            const res = await fetch(`${API_BASE}/api/reservas/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Error al eliminar reserva');
            await cargarTodo();
        } catch (e) { setError(e.message); }
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setFormData({
            cliente_id: '',
            paquete_id: '',
            usuario_id: '',
            fecha_reserva: new Date().toISOString().split('T')[0],
            fecha_salida: '',
            fecha_retorno: '',
            estado: '',
            precio_total: '',
            notas: ''
        });
        setEditandoId(null);
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    };

    // Calcular duración
    const calcularDuracion = (fechaSalida, fechaRetorno) => {
        if (!fechaSalida || !fechaRetorno) return 'N/A';
        const salida = new Date(fechaSalida);
        const retorno = new Date(fechaRetorno);
        const diferencia = retorno.getTime() - salida.getTime();
        const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
        return `${dias} días`;
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <Layout activeMenu="Reservas">
            <div className="content">
                <h1 className="page-title">
                    <i className="fas fa-calendar-check"></i>
                    Gestión de Reservas
                </h1>
                {error && (<div className="alert error">{error}</div>)}
                {loading && (<div className="loading">Cargando...</div>)}

                {/* Formulario de Reservas */}
                <div className="form-container">
                    <h2 className="form-title">
                        <i className={editandoId ? "fas fa-edit" : "fas fa-plus-circle"}></i>
                        {editandoId ? 'Editar Reserva' : 'Crear Nueva Reserva'}
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
                                        <option key={c.cliente_id} value={c.cliente_id}>
                                            {`${c.nombre} ${c.apellido}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="paquete_id">Paquete Turístico *</label>
                                <select 
                                    id="paquete_id" 
                                    name="paquete_id" 
                                    value={formData.paquete_id} 
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un paquete</option>
                                    {paquetesList.map(p => (
                                        <option key={p.paquete_id} value={p.paquete_id}>
                                            {p.nombre_paquete}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="usuario_id">Agente Responsable *</label>
                                <select 
                                    id="usuario_id" 
                                    name="usuario_id" 
                                    value={formData.usuario_id} 
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un agente</option>
                                    {usuariosList.map(u => (
                                        <option key={u.usuario_id} value={u.usuario_id}>
                                            {u.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fecha_reserva">Fecha de Reserva *</label>
                                <input 
                                    type="date" 
                                    id="fecha_reserva" 
                                    name="fecha_reserva" 
                                    value={formData.fecha_reserva}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fecha_salida">Fecha de Salida *</label>
                                <input 
                                    type="date" 
                                    id="fecha_salida" 
                                    name="fecha_salida" 
                                    value={formData.fecha_salida}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fecha_retorno">Fecha de Retorno *</label>
                                <input 
                                    type="date" 
                                    id="fecha_retorno" 
                                    name="fecha_retorno" 
                                    value={formData.fecha_retorno}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="estado">Estado *</label>
                                <select 
                                    id="estado" 
                                    name="estado" 
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione estado</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmada">Confirmada</option>
                                    <option value="cancelada">Cancelada</option>
                                    <option value="completada">Completada</option>
                                </select>
                            </div>
                            <div className="form-group price-input">
                                <label htmlFor="precio_total">Precio Total ($) *</label>
                                <input 
                                    type="number" 
                                    id="precio_total" 
                                    name="precio_total" 
                                    min="0" 
                                    step="0.01" 
                                    placeholder="0.00" 
                                    value={formData.precio_total}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label htmlFor="notas">Notas Adicionales</label>
                                <textarea 
                                    id="notas" 
                                    name="notas" 
                                    value={formData.notas}
                                    onChange={handleInputChange}
                                    placeholder="Información adicional sobre la reserva, requerimientos especiales, etc..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={cancelarEdicion}
                            >
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-save"></i> {editandoId ? 'Actualizar' : 'Guardar'} Reserva
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de Reservas */}
                <div className="table-container">
                    <div className="table-header">
                        <div className="table-title">Lista de Reservas</div>
                        <div className="table-actions">
                            <button id="btnExportar">
                                <i className="fas fa-file-export"></i> Exportar
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
                            {reservas.map(reserva => (
                                <tr key={reserva.reserva_id}>
                                    <td>#{reserva.reserva_id.toString().padStart(3, '0')}</td>
                                    <td>
                                        <div className="reserva-info">
                                            <span className="reserva-cliente">{reserva.cliente_nombre || (clientesList.find(c => c.cliente_id === reserva.cliente_id)?.nombre + ' ' + (clientesList.find(c => c.cliente_id === reserva.cliente_id)?.apellido || ''))}</span>
                                            <span className="reserva-paquete">{reserva.nombre_paquete || (paquetesList.find(p => p.paquete_id === reserva.paquete_id)?.nombre_paquete)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="reserva-info">
                                            <span className="reserva-fechas">Salida: {formatearFecha(reserva.fecha_salida)}</span>
                                            <span className="reserva-fechas">Retorno: {formatearFecha(reserva.fecha_retorno)}</span>
                                            <span className="reserva-fechas">Duración: {calcularDuracion(reserva.fecha_salida, reserva.fecha_retorno)}</span>
                                        </div>
                                    </td>
                                    <td>{reserva.usuario_nombre || (usuariosList.find(u => u.usuario_id === reserva.usuario_id)?.nombre)}</td>
                                    <td className="price">${Number(reserva.precio_total || 0).toFixed(2)}</td>
                                    <td>
                                        <span className={`status ${reserva.estado}`}>
                                            {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="action-btn editar" 
                                            onClick={() => editarReserva(reserva.reserva_id)}
                                        >
                                            <i className="fas fa-edit"></i> Editar
                                        </button>
                                        <button 
                                            className="action-btn delete" 
                                            onClick={() => eliminarReserva(reserva.reserva_id)}
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

export default Reservas;
