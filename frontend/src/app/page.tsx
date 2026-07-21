"use client";

import React, { useState, useEffect } from 'react';
import { fetchObjects, createObject, deleteObject, AppObject } from '../lib/api';

export default function Home() {
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
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {/* CARD PRINCIPALE : BORDURE VIOLETTE */}
      <div style={{
        maxWidth: '650px',
        margin: '0 auto 40px auto',
        backgroundColor: '#ffffff',
        border: '8px solid #a855f7',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        
        {/* TITRE */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '300',
          letterSpacing: '2px',
          color: '#1f2937',
          textTransform: 'uppercase',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          FAIRE UN <br />
          <span style={{ fontWeight: '400' }}>ENREGISTREMENT</span>
        </h2>

        {/* PARAGRAPHE D'INTRODUCTION */}
        <p style={{
          color: '#4b5563',
          fontSize: '14px',
          lineHeight: '1.6',
          maxWidth: '480px',
          margin: '0 auto 30px auto',
          fontWeight: '300'
        }}>
          « enregistrement des objets faites ici. le champs image est obligatoire »
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
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
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
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box'
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
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#a855f7',
                color: '#ffffff',
                padding: '12px 36px',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Envoi...' : 'Soumettre'}
            </button>
          </div>
        </form>
      </div>

      {/* ENTRÉES ENREGISTRÉES */}
      <div style={{
        maxWidth: '650px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid #e9d5ff',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '16px', color: '#374151', marginBottom: '15px', textAlign: 'center' }}>
          Entrées enregistrées ({objects.length})
        </h3>

        {objects.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '14px' }}>
            Aucune donnée pour le moment.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {objects.map((obj) => {
              const fileUrl = obj.imageUrl;

              return (
                <div
                  key={obj._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: '14px'
                  }}
                >
                  <div>
                    <strong style={{ color: '#111827', display: 'block' }}>{obj.title}</strong>
                    <span style={{ color: '#4b5563', fontSize: '13px' }}>{obj.description}</span>
                    
                    {/* LIEN DE FICHIER CLIQUABLE */}
                    {fileUrl && (
                      <div style={{ marginTop: '4px' }}>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#a855f7',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                           Voir / Ouvrir le fichier ({obj.imageUrl ? obj.imageUrl.split('/').pop() : 'fichier'})
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(obj._id)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #fca5a5',
                      color: '#ef4444',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}