import React, { useState, useEffect } from 'react';
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

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:5000';

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
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    destino: '', nombre_destino: '', pais: '', ciudad: '', descripcion: '', categoria: '', activo: 'true',
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargarDestinos();
  }, []);

  async function cargarDestinos() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/destinos`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error al cargar destinos');
      const mapped = (json.data || []).map(d => ({
        id: d.destino_id,
        nombre_destino: d.nombre_destino,
        pais: d.pais,
        ciudad: d.ciudad,
        descripcion: d.descripcion,
        categoria: d.categoria,
        activo: d.activo,
        destino: `${d.ciudad ? d.ciudad + ', ' : ''}${d.pais || ''}`.trim(),
      }));
      setDestinos(mapped);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      nombre_destino: form.nombre_destino,
      pais: form.pais,
      ciudad: form.ciudad,
      descripcion: form.descripcion,
      categoria: form.categoria,
      activo: form.activo === 'true',
    };
    try {
      setError('');
      if (editandoId) {
        const res = await fetch(`${API_BASE}/api/destinos/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Error al actualizar destino');
        setEditandoId(null);
      } else {
        const res = await fetch(`${API_BASE}/api/destinos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Error al crear destino');
      }
      await cargarDestinos();
      setForm({ destino: '', nombre_destino: '', pais: '', ciudad: '', descripcion: '', categoria: '', activo: 'true' });
    } catch (e) {
      setError(e.message);
    }
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

  async function handleDelete(id) {
    if (!window.confirm('¿Está seguro de que desea eliminar este destino?')) return;
    try {
      setError('');
      const res = await fetch(`${API_BASE}/api/destinos/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error al eliminar destino');
      await cargarDestinos();
    } catch (e) {
      setError(e.message);
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
        {error && (<div className="alert error">{error}</div>)}
        {loading && (<div className="loading">Cargando...</div>)}
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
