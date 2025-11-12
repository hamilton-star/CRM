import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const Comunicaciones = () => {
    // Datos de ejemplo
    const [comunicaciones, setComunicaciones] = useState([
        {
            interaccion_id: 1,
            cliente_id: 1,
            usuario_id: 1,
            tipo_interaccion: "llamada",
            fecha_hora: "2023-10-15T14:30:00",
            descripcion: "Cliente consultó sobre disponibilidad de paquete a París para diciembre. Se envió información detallada por email."
        },
        {
            interaccion_id: 2,
            cliente_id: 2,
            usuario_id: 2,
            tipo_interaccion: "email",
            fecha_hora: "2023-10-16T10:15:00",
            descripcion: "Envío de cotización para paquete de aventura en la selva. Cliente mostró interés en fechas de enero."
        },
        {
            interaccion_id: 3,
            cliente_id: 3,
            usuario_id: 1,
            tipo_interaccion: "whatsapp",
            fecha_hora: "2023-10-17T16:45:00",
            descripcion: "Coordinación de detalles finales para viaje a Machu Picchu. Confirmación de horarios de vuelo y traslados."
        },
        {
            interaccion_id: 4,
            cliente_id: 1,
            usuario_id: 3,
            tipo_interaccion: "presencial",
            fecha_hora: "2023-10-18T11:00:00",
            descripcion: "Reunión en oficina para firmar contratos y realizar pago inicial. Cliente muy satisfecho con la atención."
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

    // Establecer fecha y hora actual por defecto al cargar el componente
    useEffect(() => {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        setFormData(prev => ({
            ...prev,
            fecha_hora: ahora.toISOString().slice(0, 16)
        }));
    }, []);

    // Función para manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editandoId) {
            // Actualizar comunicación existente
            setComunicaciones(comunicaciones.map(com => 
                com.interaccion_id === editandoId 
                    ? { ...formData, interaccion_id: editandoId } 
                    : com
            ));
            setEditandoId(null);
            alert('Interacción actualizada correctamente');
        } else {
            // Agregar nueva comunicación
            const nuevoId = comunicaciones.length > 0 
                ? Math.max(...comunicaciones.map(c => c.interaccion_id)) + 1 
                : 1;
            
            setComunicaciones([
                ...comunicaciones,
                {
                    ...formData,
                    interaccion_id: nuevoId,
                    cliente_id: parseInt(formData.cliente_id),
                    usuario_id: parseInt(formData.usuario_id)
                }
            ]);
            alert('Interacción registrada correctamente');
        }
        
        // Limpiar formulario
        resetForm();
    };

    // Función para resetear el formulario
    const resetForm = () => {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        
        setFormData({
            cliente_id: '',
            usuario_id: '',
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
                usuario_id: comunicacion.usuario_id.toString(),
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
    const eliminarComunicacion = (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta interacción?')) {
            setComunicaciones(comunicaciones.filter(c => c.interaccion_id !== id));
            alert('Interacción eliminada correctamente');
        }
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
                                    {Object.entries(clientes).map(([id, nombre]) => (
                                        <option key={`cliente-${id}`} value={id}>{nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="usuario_id">Agente *</label>
                                <select 
                                    id="usuario_id" 
                                    name="usuario_id" 
                                    value={formData.usuario_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un agente</option>
                                    {Object.entries(usuarios).map(([id, nombre]) => (
                                        <option key={`usuario-${id}`} value={id}>{nombre}</option>
                                    ))}
                                </select>
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
                                                <span className="interaction-client">
                                                    {clientes[comunicacion.cliente_id] || 'Cliente desconocido'}
                                                </span>
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
                                        <td>{usuarios[comunicacion.usuario_id] || 'Usuario desconocido'}</td>
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
