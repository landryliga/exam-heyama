"use client";

import React, { useState, useEffect } from 'react';
import { fetchObjects, createObject, deleteObject, AppObject } from '../lib/api';

export default function ObjectManager() {
  const [objects, setObjects] = useState<AppObject[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      const data = await fetchObjects();
      setObjects(data);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Veuillez sélectionner un fichier');

    setLoading(true);
    try {
      await createObject(title, description, file);
      setTitle('');
      setDescription('');
      setFile(null);
      await loadObjects();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await deleteObject(id);
        setObjects(objects.filter((obj) => obj._id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* CARD PRINCIPALE : BORDURE VIOLETTE (EXACTEMENT COMME SUR L'IMAGE) */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '8px solid #9333ea',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
      }}>
        
        {/* TITRE */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '300',
          letterSpacing: '2px',
          color: '#262626',
          textTransform: 'uppercase',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          FAIRE UNE <br />
          <span style={{ fontWeight: '400' }}>ENREGISTREMENT</span>
        </h2>

        {/* PARAGRAPHE DESCRIPTIF */}
        <p style={{
          color: '#525252',
          fontSize: '14px',
          lineHeight: '1.6',
          maxWidth: '480px',
          margin: '0 auto 30px auto',
          fontWeight: '300'
        }}>
          «  enregistrement des objets faites ici. le champs image est obligatoire »
        </p>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'left' }}>
          
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your Title"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #d4d4d4',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: '#333333'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your message"
              rows={3}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #d4d4d4',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: '#333333'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              required
              style={{
                width: '100%',
                fontSize: '13px',
                color: '#525252',
                border: '1px solid #d4d4d4',
                padding: '8px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#9333ea',
                color: '#ffffff',
                padding: '12px 36px',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.6 : 1,
                borderRadius: '0px'
              }}
            >
              {loading ? 'Envoi...' : 'Soumettre'}
            </button>
          </div>
        </form>
      </div>

      {/* RÉSULTATS / LISTE DES ENTRÉES EN BAS */}
      <div style={{
        marginTop: '30px',
        backgroundColor: '#ffffff',
        border: '1px solid #e9d5ff',
        padding: '20px',
        borderRadius: '4px'
      }}>
        <h3 style={{ fontSize: '16px', color: '#404040', marginBottom: '15px', textAlign: 'center' }}>
          Entrées enregistrées ({objects.length})
        </h3>

        {objects.length === 0 ? (
          <p style={{ color: '#a3a3a3', textAlign: 'center', fontSize: '14px' }}>
            Aucune donnée pour le moment.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {objects.map((obj) => (
              <div
                key={obj._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #f5f5f5',
                  fontSize: '14px'
                }}
              >
                <div>
                  <strong style={{ color: '#171717', display: 'block' }}>{obj.title}</strong>
                  <span style={{ color: '#737373', fontSize: '13px' }}>{obj.description}</span>
                  <div style={{ color: '#9333ea', fontSize: '12px', fontFamily: 'monospace', marginTop: '2px' }}>
                    📎 {obj.imageUrl ? obj.imageUrl.split('/').pop() : ''}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(obj._id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #fca5a5',
                    color: '#dc2626',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    borderRadius: '3px'
                  }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}