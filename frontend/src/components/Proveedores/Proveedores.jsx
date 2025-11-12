import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

const tiposProveedor = [
  { value: '', label: 'Seleccione un tipo' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'aerolinea', label: 'Aerolínea' },
  { value: 'transporte', label: 'Transporte Terrestre' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'guia', label: 'Guía Turístico' },
  { value: 'actividad', label: 'Actividad/Excursión' },
  { value: 'seguro', label: 'Seguro de Viaje' },
  { value: 'otro', label: 'Otro' }
];

const traducirTipo = (tipo) => {
  const tipos = {
    'hotel': 'Hotel',
    'aerolinea': 'Aerolínea',
    'transporte': 'Transporte',
    'restaurante': 'Restaurante',
    'guia': 'Guía Turístico',
    'actividad': 'Actividad',
    'seguro': 'Seguro de Viaje',
    'otro': 'Otro'
  };
  return tipos[tipo] || tipo;
};

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([
    {
      proveedor_id: 1,
      nombre_proveedor: "Hotel Paradise Resort",
      tipo: "hotel",
      contacto_nombre: "María González",
      email: "reservas@paradiseresort.com",
      telefono: "+1 800 123 4567",
      direccion: "Av. Principal 123, Cancún, México",
      activo: true
    },
    {
      proveedor_id: 2,
      nombre_proveedor: "SkyWings Airlines",
      tipo: "aerolinea",
      contacto_nombre: "Carlos Rodríguez",
      email: "grupos@skywings.com",
      telefono: "+1 800 987 6543",
      direccion: "Aeropuerto Internacional, Terminal 2",
      activo: true
    },
    {
      proveedor_id: 3,
      nombre_proveedor: "Adventure Tours",
      tipo: "actividad",
      contacto_nombre: "Ana Martínez",
      email: "info@adventuretours.com",
      telefono: "+1 555 123 7890",
      direccion: "Calle Aventura 456, Lima, Perú",
      activo: false
    }
  ]);

  const [form, setForm] = useState({
    nombre_proveedor: '',
    tipo: '',
    contacto_nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    activo: 'true'
  });
  
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const proveedorData = {
      ...form,
      activo: form.activo === 'true',
      proveedor_id: editandoId || (proveedores.length > 0 ? Math.max(...proveedores.map(p => p.proveedor_id)) + 1 : 1)
    };

    if (editandoId) {
      setProveedores(proveedores.map(p => 
        p.proveedor_id === editandoId ? { ...p, ...proveedorData } : p
      ));
    } else {
      setProveedores([...proveedores, proveedorData]);
    }

    resetForm();
  };

  const handleEdit = (id) => {
    const proveedor = proveedores.find(p => p.proveedor_id === id);
    if (proveedor) {
      setForm({
        nombre_proveedor: proveedor.nombre_proveedor,
        tipo: proveedor.tipo,
        contacto_nombre: proveedor.contacto_nombre,
        email: proveedor.email,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
        activo: proveedor.activo.toString()
      });
      setEditandoId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      setProveedores(proveedores.filter(p => p.proveedor_id !== id));
    }
  };

  const resetForm = () => {
    setForm({
      nombre_proveedor: '',
      tipo: '',
      contacto_nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      activo: 'true'
    });
    setEditandoId(null);
  };

  const proveedoresFiltrados = proveedores.filter(proveedor => 
    proveedor.nombre_proveedor.toLowerCase().includes(filtro.toLowerCase()) ||
    proveedor.contacto_nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Layout activeMenu="proveedores">
      <div className="header">
        <div className="header-left">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Buscar proveedores..." 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="content">
        <h1 className="page-title">
          <i className="fas fa-handshake"></i>
          Gestión de Proveedores
        </h1>

        {/* Formulario de Proveedores */}
        <div className="form-container">
          <h2 className="form-title">
            <i className={editandoId ? "fas fa-edit" : "fas fa-plus-circle"}></i>
            {editandoId ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre_proveedor">Nombre del Proveedor *</label>
                <input 
                  type="text" 
                  id="nombre_proveedor" 
                  name="nombre_proveedor" 
                  value={form.nombre_proveedor}
                  onChange={handleChange}
                  placeholder="Ej: Hotel Paradise Resort" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo de Proveedor *</label>
                <select 
                  id="tipo" 
                  name="tipo" 
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  {tiposProveedor.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contacto_nombre">Nombre de Contacto *</label>
                <input 
                  type="text" 
                  id="contacto_nombre" 
                  name="contacto_nombre" 
                  value={form.contacto_nombre}
                  onChange={handleChange}
                  placeholder="Ej: María González" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ej: contacto@proveedor.com" 
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
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ej: +1 234 567 8900" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="activo">Estado *</label>
                <select 
                  id="activo" 
                  name="activo" 
                  value={form.activo}
                  onChange={handleChange}
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
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Dirección completa del proveedor..."
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
                <i className="fas fa-save"></i> {editandoId ? 'Actualizar' : 'Guardar'} Proveedor
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de Proveedores */}
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">Lista de Proveedores</div>
            <div className="table-actions">
              <button>
                <i className="fas fa-file-export"></i> Exportar
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Tipo</th>
                <th>Contacto</th>
                <th>Información de Contacto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedoresFiltrados.map(proveedor => (
                <tr key={proveedor.proveedor_id}>
                  <td>#{proveedor.proveedor_id.toString().padStart(3, '0')}</td>
                  <td>{proveedor.nombre_proveedor}</td>
                  <td>{traducirTipo(proveedor.tipo)}</td>
                  <td>{proveedor.contacto_nombre}</td>
                  <td className="contact-info">
                    <span className="contact-email">{proveedor.email}</span>
                    <span className="contact-phone">{proveedor.telefono}</span>
                  </td>
                  <td>
                    <span className={`status ${proveedor.activo ? 'active' : 'inactive'}`}>
                      {proveedor.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn editar" 
                      onClick={() => handleEdit(proveedor.proveedor_id)}
                    >
                      <i className="fas fa-edit"></i> Editar
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDelete(proveedor.proveedor_id)}
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

export default Proveedores;
