import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const PaquetesTuristicos = () => {
    // Datos de ejemplo
    const [paquetes, setPaquetes] = useState([
        {
            paquete_id: 1,
            nombre_paquete: "Aventura en la Selva Amazónica",
            descripcion: "Explora la selva amazónica con guías expertos, incluye alojamiento en eco-lodge, comidas y todas las actividades.",
            destino_id: 2,
            duracion_dias: 5,
            precio_base: 1250.00,
            tipo_paquete: "aventura",
            activo: true
        },
        {
            paquete_id: 2,
            nombre_paquete: "Romance en París",
            descripcion: "Paquete todo incluido para parejas: hotel 5 estrellas, cena en Torre Eiffel, crucero por el Sena y tours privados.",
            destino_id: 1,
            duracion_dias: 4,
            precio_base: 2200.00,
            tipo_paquete: "romantico",
            activo: true
        },
        {
            paquete_id: 3,
            nombre_paquete: "Cultural en Machu Picchu",
            descripcion: "Descubre la cultura inca con visitas a Machu Picchu, Valle Sagrado y ciudad de Cuzco. Incluye guías especializados.",
            destino_id: 2,
            duracion_dias: 6,
            precio_base: 1800.00,
            tipo_paquete: "cultural",
            activo: false
        }
    ]);

    // Mapeo de destinos
    const destinos = {
        1: "París, Francia",
        2: "Machu Picchu, Perú",
        3: "Cancún, México",
        4: "Tokio, Japón",
        5: "Roma, Italia",
        6: "New York, USA"
    };

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre_paquete: '',
        descripcion: '',
        destino_id: '',
        duracion_dias: '',
        precio_base: '',
        tipo_paquete: '',
        activo: 'true'
    });
    
    const [editandoId, setEditandoId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Traducir tipos de paquetes
    const traducirTipoPaquete = (tipo) => {
        const tipos = {
            'todo_incluido': 'Todo Incluido',
            'solo_hotel': 'Solo Hotel',
            'vuelo_hotel': 'Vuelo + Hotel',
            'aventura': 'Aventura',
            'cultural': 'Cultural',
            'romantico': 'Romántico',
            'familiar': 'Familiar',
            'lujo': 'Lujo'
        };
        return tipos[tipo] || tipo;
    };

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
        
        const nuevoPaquete = {
            ...formData,
            destino_id: parseInt(formData.destino_id),
            duracion_dias: parseInt(formData.duracion_dias),
            precio_base: parseFloat(formData.precio_base),
            activo: formData.activo === 'true'
        };

        if (editandoId) {
            // Actualizar paquete existente
            setPaquetes(paquetes.map(p => 
                p.paquete_id === editandoId ? { ...nuevoPaquete, paquete_id: editandoId } : p
            ));
            setEditandoId(null);
        } else {
            // Agregar nuevo paquete
            const nuevoId = paquetes.length > 0 ? Math.max(...paquetes.map(p => p.paquete_id)) + 1 : 1;
            setPaquetes([...paquetes, { ...nuevoPaquete, paquete_id: nuevoId }]);
        }

        // Limpiar formulario
        setFormData({
            nombre_paquete: '',
            descripcion: '',
            destino_id: '',
            duracion_dias: '',
            precio_base: '',
            tipo_paquete: '',
            activo: 'true'
        });
    };

    // Editar paquete
    const editarPaquete = (id) => {
        const paquete = paquetes.find(p => p.paquete_id === id);
        if (paquete) {
            setFormData({
                nombre_paquete: paquete.nombre_paquete,
                descripcion: paquete.descripcion,
                destino_id: paquete.destino_id.toString(),
                duracion_dias: paquete.duracion_dias.toString(),
                precio_base: paquete.precio_base.toString(),
                tipo_paquete: paquete.tipo_paquete,
                activo: paquete.activo.toString()
            });
            setEditandoId(id);
        }
    };

    // Eliminar paquete
    const eliminarPaquete = (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este paquete turístico?')) {
            setPaquetes(paquetes.filter(p => p.paquete_id !== id));
        }
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setFormData({
            nombre_paquete: '',
            descripcion: '',
            destino_id: '',
            duracion_dias: '',
            precio_base: '',
            tipo_paquete: '',
            activo: 'true'
        });
        setEditandoId(null);
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <Layout activeMenu="Paquetes Turísticos">
            <div className="content">
                <h1 className="page-title">
                    <i className="fas fa-suitcase-rolling"></i>
                    Gestión de Paquetes Turísticos
                </h1>

                {/* Formulario de Paquetes Turísticos */}
                <div className="form-container">
                    <h2 className="form-title">
                        <i className="fas fa-plus-circle"></i>
                        {editandoId ? 'Editar Paquete Turístico' : 'Crear Nuevo Paquete Turístico'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nombre_paquete">Nombre del Paquete *</label>
                                <input 
                                    type="text" 
                                    id="nombre_paquete" 
                                    name="nombre_paquete" 
                                    value={formData.nombre_paquete}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Aventura en la Selva Amazónica" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="destino_id">Destino *</label>
                                <select 
                                    id="destino_id" 
                                    name="destino_id" 
                                    value={formData.destino_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un destino</option>
                                    {Object.entries(destinos).map(([id, nombre]) => (
                                        <option key={id} value={id}>{nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="duracion_dias">Duración (días) *</label>
                                <input 
                                    type="number" 
                                    id="duracion_dias" 
                                    name="duracion_dias" 
                                    value={formData.duracion_dias}
                                    onChange={handleInputChange}
                                    min="1" 
                                    max="30" 
                                    placeholder="Ej: 7" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo_paquete">Tipo de Paquete *</label>
                                <select 
                                    id="tipo_paquete" 
                                    name="tipo_paquete" 
                                    value={formData.tipo_paquete}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="todo_incluido">Todo Incluido</option>
                                    <option value="solo_hotel">Solo Hotel</option>
                                    <option value="vuelo_hotel">Vuelo + Hotel</option>
                                    <option value="aventura">Aventura</option>
                                    <option value="cultural">Cultural</option>
                                    <option value="romantico">Romántico</option>
                                    <option value="familiar">Familiar</option>
                                    <option value="lujo">Lujo</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group price-input">
                                <label htmlFor="precio_base">Precio Base ($) *</label>
                                <div className="price-input-container">
                                    <span className="currency-symbol">$</span>
                                    <input 
                                        type="number" 
                                        id="precio_base" 
                                        name="precio_base" 
                                        value={formData.precio_base}
                                        onChange={handleInputChange}
                                        min="0" 
                                        step="0.01" 
                                        placeholder="0.00" 
                                        required 
                                    />
                                </div>
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
                                <label htmlFor="descripcion">Descripción del Paquete *</label>
                                <textarea 
                                    id="descripcion" 
                                    name="descripcion" 
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Describa los detalles, servicios incluidos, actividades, etc..." 
                                    required
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
                                <i className="fas fa-save"></i> {editandoId ? 'Actualizar' : 'Guardar'} Paquete
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de Paquetes Turísticos */}
                <div className="table-container">
                    <div className="table-header">
                        <div className="table-title">Catálogo de Paquetes Turísticos</div>
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
                                <th>Paquete</th>
                                <th>Destino</th>
                                <th>Duración</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paquetes.map(paquete => (
                                <tr key={paquete.paquete_id}>
                                    <td>#{paquete.paquete_id.toString().padStart(3, '0')}</td>
                                    <td>
                                        <strong>{paquete.nombre_paquete}</strong>
                                        <div style={{ fontSize: '12px', color: '#95a5a6', marginTop: '4px' }}>
                                            {paquete.descripcion.substring(0, 60)}...
                                        </div>
                                    </td>
                                    <td>{destinos[paquete.destino_id] || 'Desconocido'}</td>
                                    <td>{paquete.duracion_dias} días</td>
                                    <td><span className="package-type">{traducirTipoPaquete(paquete.tipo_paquete)}</span></td>
                                    <td className="price">${paquete.precio_base.toFixed(2)}</td>
                                    <td>
                                        <span className={`status ${paquete.activo ? 'active' : 'inactive'}`}>
                                            {paquete.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="action-btn editar" 
                                            onClick={() => editarPaquete(paquete.paquete_id)}
                                        >
                                            <i className="fas fa-edit"></i> Editar
                                        </button>
                                        <button 
                                            className="action-btn delete" 
                                            onClick={() => eliminarPaquete(paquete.paquete_id)}
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

export default PaquetesTuristicos;
