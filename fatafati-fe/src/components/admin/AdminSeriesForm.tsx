'use client';

import React, { useState } from 'react';
import { Series, SeriesGenre } from '@fatafati/common';
import { Save, Trash2 } from 'lucide-react';

interface AdminSeriesFormProps {
  series: Partial<Series>;
  onSave: (series: Partial<Series>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const GENRES: SeriesGenre[] = [
  'all', 'sci-fi', 'horror', 'cyberpunk', 'thriller', 
  'space', 'mystery', 'fantasy', 'reality-show', 'anime', 
  'comedy', 'drama'
];

export function AdminSeriesForm({ series, onSave, onDelete }: AdminSeriesFormProps) {
  const [formData, setFormData] = useState<Partial<Series>>({
    id: series.id,
    title: series.title || '',
    tagline: series.tagline || '',
    description: series.description || '',
    coverImage: series.coverImage || '',
    backdropImage: series.backdropImage || '',
    previewVideoUrl: series.previewVideoUrl || '',
    genre: series.genre || 'all',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9rem',
    marginBottom: '16px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
  };

  return (
    <div className="cyber-panel" style={{ padding: '24px', background: 'rgba(15, 25, 40, 0.8)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="text-cyber-glow" style={{ fontSize: '1.4rem', color: '#00f0ff', margin: 0 }}>
          {series.id ? 'Edit Series' : 'New Series'}
        </h2>
        {series.id && onDelete && (
          <button 
            type="button" 
            onClick={() => {
              if (confirm('Are you sure you want to delete this series?')) {
                onDelete(series.id!);
              }
            }}
            style={{
              background: 'rgba(236, 72, 153, 0.1)',
              color: '#ec4899',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <Trash2 size={16} /> Delete
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Title</label>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          style={inputStyle} 
          required 
        />

        <label style={labelStyle}>Tagline</label>
        <input 
          type="text" 
          name="tagline" 
          value={formData.tagline} 
          onChange={handleChange} 
          style={inputStyle} 
        />

        <label style={labelStyle}>Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
        />

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Cover Image URL</label>
            <input 
              type="text" 
              name="coverImage" 
              value={formData.coverImage} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Backdrop Image URL</label>
            <input 
              type="text" 
              name="backdropImage" 
              value={formData.backdropImage} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Preview Video URL</label>
            <input 
              type="text" 
              name="previewVideoUrl" 
              value={formData.previewVideoUrl} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Genre</label>
            <select 
              name="genre" 
              value={formData.genre} 
              onChange={handleChange} 
              style={inputStyle}
            >
              {GENRES.map(g => (
                <option key={g} value={g} style={{ color: '#000' }}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="cyber-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Series'}
          </button>
        </div>
      </form>
    </div>
  );
}
