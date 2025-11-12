import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const Reservas = () => {
    // Datos de ejemplo
    const [reservas, setReservas] = useState([
        {
            reserva_id: 1,
            cliente_id: 1,
            paquete_id: 2,
            usuario_id: 1,
            fecha_reserva: "2023-10-15",
            fecha_salida: "2023-12-20",
            fecha_retorno: "2023-12-24",
            estado: "confirmada",
            precio_total: 2200.00,
            notas: "Cliente solicita habitación con vista a la Torre Eiffel"
        },
        {
            reserva_id: 2,
            cliente_id: 2,
            paquete_id: 1,
            usuario_id: 2,
            fecha_reserva: "2023-10-18",
            fecha_salida: "2024-01-15",
            fecha_retorno: "2024-01-20",
            estado: "pendiente",
            precio_total: 1250.00,
            notas: "Es alérgico a mariscos, considerar en las comidas"
        },
        {
            reserva_id: 3,
            cliente_id: 3,
            paquete_id: 3,
            usuario_id: 1,
            fecha_reserva: "2023-09-20",
            fecha_salida: "2023-11-10",
            fecha_retorno: "2023-11-16",
            estado: "completada",
            precio_total: 1800.00,
            notas: "Viaje realizado satisfactoriamente"
        }
    ]);

    // Mapeo de datos
    const clientes = {
        1: "María González",
        2: "Carlos Rodríguez", 
        3: "Ana Martínez",
        4: "Juan Pérez",
        5: "Laura Sánchez"
    };

    const paquetes = {
        1: "Aventura en la Selva Amazónica",
        2: "Romance en París",
        3: "Cultural en Machu Picchu",
        4: "Playa en Cancún",
        5: "Aventura en Tokio"
    };

    const usuarios = {
        1: "Roberto Jiménez",
        2: "Sofia Hernández",
        3: "Miguel Ángel Torres"
    };

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
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const reservaData = {
            ...formData,
            cliente_id: parseInt(formData.cliente_id),
            paquete_id: parseInt(formData.paquete_id),
            usuario_id: parseInt(formData.usuario_id),
            precio_total: parseFloat(formData.precio_total)
        };

        if (editandoId) {
            // Actualizar reserva existente
            setReservas(reservas.map(reserva => 
                reserva.reserva_id === editandoId 
                    ? { ...reserva, ...reservaData } 
                    : reserva
            ));
            setEditandoId(null);
        } else {
            // Agregar nueva reserva
            const nuevaReserva = {
                ...reservaData,
                reserva_id: reservas.length > 0 ? Math.max(...reservas.map(r => r.reserva_id)) + 1 : 1
            };
            setReservas([...reservas, nuevaReserva]);
        }

        // Limpiar formulario
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
    const eliminarReserva = (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta reserva?')) {
            setReservas(reservas.filter(r => r.reserva_id !== id));
        }
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
                                    {Object.entries(clientes).map(([id, nombre]) => (
                                        <option key={id} value={id}>{nombre}</option>
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
                                    {Object.entries(paquetes).map(([id, nombre]) => (
                                        <option key={id} value={id}>{nombre}</option>
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
                                    {Object.entries(usuarios).map(([id, nombre]) => (
                                        <option key={id} value={id}>{nombre}</option>
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
                                            <span className="reserva-cliente">{clientes[reserva.cliente_id]}</span>
                                            <span className="reserva-paquete">{paquetes[reserva.paquete_id]}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="reserva-info">
                                            <span className="reserva-fechas">Salida: {formatearFecha(reserva.fecha_salida)}</span>
                                            <span className="reserva-fechas">Retorno: {formatearFecha(reserva.fecha_retorno)}</span>
                                            <span className="reserva-fechas">Duración: {calcularDuracion(reserva.fecha_salida, reserva.fecha_retorno)}</span>
                                        </div>
                                    </td>
                                    <td>{usuarios[reserva.usuario_id]}</td>
                                    <td className="price">${reserva.precio_total.toFixed(2)}</td>
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
