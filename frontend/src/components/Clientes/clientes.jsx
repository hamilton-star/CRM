import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const Clientes = () => {
    // Datos de ejemplo
    const [clientes, setClientes] = useState([
        {
            cliente_id: 1,
            nombre: "María",
            apellido: "González",
            email: "maria.gonzalez@email.com",
            telefono: "+1 234 567 8901",
            direccion: "Av. Principal 123, Buenos Aires, Argentina",
            fecha_nacimiento: "1985-06-15",
            documento_identidad: "DNI 35.678.901",
            nacionalidad: "argentina",
            fecha_registro: "2023-01-15",
            activo: true
        },
        {
            cliente_id: 2,
            nombre: "Carlos",
            apellido: "Rodríguez",
            email: "carlos.rodriguez@email.com",
            telefono: "+1 345 678 9012",
            direccion: "Calle Central 456, Madrid, España",
            fecha_nacimiento: "1990-03-22",
            documento_identidad: "Pasaporte ES123456",
            nacionalidad: "españa",
            fecha_registro: "2023-02-20",
            activo: true
        },
        {
            cliente_id: 3,
            nombre: "Ana",
            apellido: "Martínez",
            email: "ana.martinez@email.com",
            telefono: "+1 456 789 0123",
            direccion: "Rua das Flores 789, São Paulo, Brasil",
            fecha_nacimiento: "1988-11-08",
            documento_identidad: "CPF 123.456.789-00",
            nacionalidad: "brasil",
            fecha_registro: "2023-03-10",
            activo: false
        }
    ]);

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

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const nuevoCliente = {
            ...formData,
            fecha_registro: new Date().toISOString().split('T')[0],
            activo: formData.activo === 'true'
        };

        if (editandoId) {
            // Actualizar cliente existente
            setClientes(clientes.map(cliente => 
                cliente.cliente_id === editandoId 
                    ? { ...nuevoCliente, cliente_id: editandoId, fecha_registro: cliente.fecha_registro } 
                    : cliente
            ));
            setEditandoId(null);
        } else {
            // Agregar nuevo cliente
            const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.cliente_id)) + 1 : 1;
            setClientes([...clientes, { ...nuevoCliente, cliente_id: nuevoId }]);
        }

        // Limpiar formulario
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
    const eliminarCliente = (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
            setClientes(clientes.filter(c => c.cliente_id !== id));
        }
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
