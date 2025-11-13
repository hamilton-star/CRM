import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const Clientes = () => {
    const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:5000';
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: '',
        documento_identidad: '',
        nacionalidad: '',
        activo: 'true'
    });
    
    const [editandoId, setEditandoId] = useState(null);

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => { cargarClientes(); }, []);

    async function cargarClientes() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/clientes`);
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Error al cargar clientes');
            setClientes(json.data || []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            telefono: formData.telefono,
            direccion: formData.direccion,
            fecha_nacimiento: formData.fecha_nacimiento,
            documento_identidad: formData.documento_identidad,
            nacionalidad: formData.nacionalidad,
            activo: formData.activo === 'true'
        };
        try {
            setError('');
            if (editandoId) {
                const res = await fetch(`${API_BASE}/api/clientes/${editandoId}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.message || 'Error al actualizar cliente');
                setEditandoId(null);
            } else {
                const res = await fetch(`${API_BASE}/api/clientes`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.message || 'Error al crear cliente');
            }
            await cargarClientes();
            setFormData({
                nombre: '', apellido: '', email: '', telefono: '', direccion: '', fecha_nacimiento: '', documento_identidad: '', nacionalidad: '', activo: 'true'
            });
        } catch (e) { setError(e.message); }
    };

    // Editar cliente
    const editarCliente = (id) => {
        const cliente = clientes.find(c => c.cliente_id === id);
        if (cliente) {
            setFormData({
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email,
                telefono: cliente.telefono,
                direccion: cliente.direccion || '',
                fecha_nacimiento: cliente.fecha_nacimiento || '',
                documento_identidad: cliente.documento_identidad,
                nacionalidad: cliente.nacionalidad || '',
                activo: cliente.activo.toString()
            });
            setEditandoId(id);
        }
    };

    // Eliminar cliente
    const eliminarCliente = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este cliente?')) return;
        try {
            setError('');
            const res = await fetch(`${API_BASE}/api/clientes/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Error al eliminar cliente');
            await cargarClientes();
        } catch (e) { setError(e.message); }
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            direccion: '',
            fecha_nacimiento: '',
            documento_identidad: '',
            nacionalidad: '',
            activo: 'true'
        });
        setEditandoId(null);
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    };

    // Calcular edad
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 'N/A';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return `${edad} años`;
    };

    return (
        <Layout activeMenu="Clientes">
            <div className="content">
                <h1 className="page-title">
                    <i className="fas fa-user-friends"></i>
                    Gestión de Clientes
                </h1>
                {error && (<div className="alert error">{error}</div>)}
                {loading && (<div className="loading">Cargando...</div>)}

                {/* Formulario de Clientes */}
                <div className="form-container">
                    <h2 className="form-title">
                        <i className="fas fa-plus-circle"></i>
                        {editandoId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre *</label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ej: María" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido">Apellido *</label>
                                <input 
                                    type="text" 
                                    id="apellido" 
                                    name="apellido" 
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                    placeholder="Ej: González" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Ej: maria@ejemplo.com" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono *</label>
                                <input 
                                    type="tel" 
                                    id="telefono" 
                                    name="telefono" 
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    placeholder="Ej: +1 234 567 8900" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                                <input 
                                    type="date" 
                                    id="fecha_nacimiento" 
                                    name="fecha_nacimiento" 
                                    value={formData.fecha_nacimiento}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nacionalidad">Nacionalidad</label>
                                <select 
                                    id="nacionalidad" 
                                    name="nacionalidad" 
                                    value={formData.nacionalidad}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccione nacionalidad</option>
                                    <option value="argentina">Argentina</option>
                                    <option value="brasil">Brasil</option>
                                    <option value="chile">Chile</option>
                                    <option value="colombia">Colombia</option>
                                    <option value="españa">España</option>
                                    <option value="estados_unidos">Estados Unidos</option>
                                    <option value="mexico">México</option>
                                    <option value="peru">Perú</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="documento_identidad">Documento de Identidad *</label>
                                <input 
                                    type="text" 
                                    id="documento_identidad" 
                                    name="documento_identidad" 
                                    value={formData.documento_identidad}
                                    onChange={handleInputChange}
                                    placeholder="Ej: DNI, Pasaporte, etc." 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="activo">Estado *</label>
                                <select 
                                    id="activo" 
                                    name="activo" 
                                    value={formData.activo}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label htmlFor="direccion">Dirección</label>
                                <textarea 
                                    id="direccion" 
                                    name="direccion" 
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    placeholder="Dirección completa del cliente..."
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
                                <i className="fas fa-save"></i> {editandoId ? 'Actualizar' : 'Guardar'} Cliente
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de Clientes */}
                <div className="table-container">
                    <div className="table-header">
                        <div className="table-title">Lista de Clientes</div>
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
                                <th>Cliente</th>
                                <th>Contacto</th>
                                <th>Documento</th>
                                <th>Nacionalidad</th>
                                <th>Fecha Registro</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.cliente_id}>
                                    <td>#{cliente.cliente_id.toString().padStart(3, '0')}</td>
                                    <td>
                                        <div className="client-info">
                                            <span className="client-name">{cliente.nombre} {cliente.apellido}</span>
                                            <span className="client-details">{calcularEdad(cliente.fecha_nacimiento)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="client-info">
                                            <span className="client-contact">{cliente.email}</span>
                                            <span className="client-contact">{cliente.telefono}</span>
                                        </div>
                                    </td>
                                    <td>{cliente.documento_identidad}</td>
                                    <td>{cliente.nacionalidad ? cliente.nacionalidad.charAt(0).toUpperCase() + cliente.nacionalidad.slice(1) : 'No especificada'}</td>
                                    <td>{formatearFecha(cliente.fecha_registro)}</td>
                                    <td>
                                        <span className={`status ${cliente.activo ? 'active' : 'inactive'}`}>
                                            {cliente.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="action-btn editar" 
                                            onClick={() => editarCliente(cliente.cliente_id)}
                                        >
                                            <i className="fas fa-edit"></i> Editar
                                        </button>
                                        <button 
                                            className="action-btn delete" 
                                            onClick={() => eliminarCliente(cliente.cliente_id)}
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

export default Clientes;
