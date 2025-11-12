import React, { useState } from 'react';
import Layout from '../Layout';

const categorias = [
  { value: '', label: 'Seleccione una categoría' },
  { value: 'playa', label: 'Playa' },
  { value: 'montaña', label: 'Montaña' },
  { value: 'ciudad', label: 'Ciudad' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'gastronomico', label: 'Gastronómico' },
];

const ejemploDestinos = [
  {
    id: 1,
    destino: 'París, Francia',
    nombre_destino: 'Torre Eiffel',
    pais: 'Francia',
    ciudad: 'París',
    descripcion: 'Uno de los monumentos más famosos del mundo, ubicado en el corazón de París.',
    categoria: 'cultural',
    activo: true,
  },
  {
    id: 2,
    destino: 'Machu Picchu, Perú',
    nombre_destino: 'Ciudadela Inca',
    pais: 'Perú',
    ciudad: 'Cuzco',
    descripcion: 'Antigua ciudadela inca ubicada en las alturas de los Andes peruanos.',
    categoria: 'aventura',
    activo: true,
  },
  {
    id: 3,
    destino: 'Cancún, México',
    nombre_destino: 'Playas de Cancún',
    pais: 'México',
    ciudad: 'Cancún',
    descripcion: 'Famoso destino de playa con aguas turquesas y arena blanca.',
    categoria: 'playa',
    activo: false,
  },
];

function traducirCategoria(categoria) {
  const map = {
    playa: 'Playa',
    montaña: 'Montaña',
    ciudad: 'Ciudad',
    aventura: 'Aventura',
    cultural: 'Cultural',
    gastronomico: 'Gastronómico',
  };
  return map[categoria] || categoria;
}

export default function Destinos() {
  const [destinos, setDestinos] = useState(ejemploDestinos);
  const [form, setForm] = useState({
    destino: '', nombre_destino: '', pais: '', ciudad: '', descripcion: '', categoria: '', activo: 'true',
  });
  const [editandoId, setEditandoId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const destinoData = {
      ...form,
      activo: form.activo === 'true',
    };
    if (editandoId) {
      setDestinos(ds => ds.map(d => d.id === editandoId ? { ...d, ...destinoData } : d));
      setEditandoId(null);
    } else {
      const id = destinos.length > 0 ? Math.max(...destinos.map(d => d.id)) + 1 : 1;
      setDestinos(ds => [...ds, { ...destinoData, id }]);
    }
    setForm({ destino: '', nombre_destino: '', pais: '', ciudad: '', descripcion: '', categoria: '', activo: 'true' });
  }

  function handleEdit(id) {
    const destino = destinos.find(d => d.id === id);
    if (destino) {
      setForm({
        destino: destino.destino,
        nombre_destino: destino.nombre_destino,
        pais: destino.pais,
        ciudad: destino.ciudad,
        descripcion: destino.descripcion,
        categoria: destino.categoria,
        activo: destino.activo ? 'true' : 'false',
      });
      setEditandoId(id);
    }
  }

  function handleDelete(id) {
    if (window.confirm('¿Está seguro de que desea eliminar este destino?')) {
      setDestinos(ds => ds.filter(d => d.id !== id));
    }
  }

  function handleCancel() {
    setForm({ destino: '', nombre_destino: '', pais: '', ciudad: '', descripcion: '', categoria: '', activo: 'true' });
    setEditandoId(null);
  }

  return (
    <Layout activeMenu="Destinos">
      <div className="header">
        <div className="header-left">
          <div className="toggle-sidebar">
            <i className="fas fa-bars"></i>
          </div>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Buscar destinos..." />
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
      <div className="content">
        <h1 className="page-title">
          <i className="fas fa-map-marked-alt"></i>
          Gestión de Destinos
        </h1>
        <div className="form-container">
          <h2 className="form-title">
            <i className={`fas ${editandoId ? 'fa-edit' : 'fa-plus-circle'}`}></i>
            {editandoId ? 'Editar Destino' : 'Agregar Nuevo Destino'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Destino</label>
                <input type="text" name="destino" value={form.destino} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nombre del Destino</label>
                <input type="text" name="nombre_destino" value={form.nombre_destino} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>País</label>
                <input type="text" name="pais" value={form.pais} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input type="text" name="ciudad" value={form.ciudad} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} required>
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="activo" value={form.activo} onChange={handleChange} required>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                <i className="fas fa-times"></i> Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i> {editandoId ? 'Actualizar Destino' : 'Guardar Destino'}
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">Lista de Destinos</div>
            <div className="table-actions">
              <button className="btn btn-primary">
                <i className="fas fa-file-export"></i> Exportar
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Destino</th>
                <th>Nombre</th>
                <th>País</th>
                <th>Ciudad</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {destinos.map(destino => (
                <tr key={destino.id}>
                  <td>{destino.destino}</td>
                  <td>{destino.nombre_destino}</td>
                  <td>{destino.pais}</td>
                  <td>{destino.ciudad}</td>
                  <td>{traducirCategoria(destino.categoria)}</td>
                  <td>
                    <span className={`status ${destino.activo ? 'active' : 'inactive'}`}>{destino.activo ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td>
                    <button className="action-btn editar" onClick={() => handleEdit(destino.id)}>
                      <i className="fas fa-edit"></i> Editar
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(destino.id)}>
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
}
