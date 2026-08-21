'use client';

import React, { useState } from 'react';
import { Episode } from '@fatafati/common';
import { Save, Trash2, Film, CheckCircle, Clock } from 'lucide-react';

interface AdminEpisodeFormProps {
  episode: Partial<Episode>;
  onSave: (episode: Partial<Episode>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function AdminEpisodeForm({ episode, onSave, onDelete }: AdminEpisodeFormProps) {
  const [formData, setFormData] = useState<Partial<Episode>>({
    id: episode.id,
    seriesId: episode.seriesId,
    parentEpisodeId: episode.parentEpisodeId || null,
    episodeNumber: episode.episodeNumber || 1,
    title: episode.title || '',
    synopsis: episode.synopsis || '',
    videoUrl: episode.videoUrl || '',
    thumbnailUrl: episode.thumbnailUrl || '',
    durationSeconds: episode.durationSeconds || 0,
    aspectRatio: episode.aspectRatio || '16:9',
    videoStatus: episode.videoStatus || 'ready',
    isSeriesFinale: episode.isSeriesFinale || false,
    choiceQuestion: episode.choiceQuestion || '',
    isLeaf: episode.isLeaf !== undefined ? episode.isLeaf : true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    <div className="cyber-panel" style={{ padding: '24px', background: 'rgba(20, 25, 40, 0.7)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="text-cyber-glow" style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
          {episode.id ? `Edit Episode ${formData.episodeNumber}` : 'New Episode'}
        </h2>
        {episode.id && onDelete && (
          <button 
            type="button" 
            onClick={() => {
              if (confirm('Are you sure you want to delete this episode? This might break the branch tree!')) {
                onDelete(episode.id!);
              }
            }}
            style={{
              background: 'transparent',
              color: '#ef4444',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
          </div>
          <div style={{ width: '120px' }}>
            <label style={labelStyle}>Depth/Num</label>
            <input 
              type="number" 
              name="episodeNumber" 
              value={formData.episodeNumber} 
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
          </div>
        </div>

        <label style={labelStyle}>Synopsis</label>
        <textarea 
          name="synopsis" 
          value={formData.synopsis} 
          onChange={handleChange} 
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} 
        />

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Video URL</label>
            <input 
              type="text" 
              name="videoUrl" 
              value={formData.videoUrl} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Thumbnail URL</label>
            <input 
              type="text" 
              name="thumbnailUrl" 
              value={formData.thumbnailUrl} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
        </div>

        <div style={{ padding: '16px', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.15)', borderRadius: '4px', marginBottom: '20px' }}>
          <h4 style={{ color: '#00f0ff', fontSize: '0.9rem', marginBottom: '12px', marginTop: 0 }}>Interactive Settings</h4>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Video Status</label>
              <select 
                name="videoStatus" 
                value={formData.videoStatus} 
                onChange={handleChange} 
                style={inputStyle}
              >
                <option value="ready" style={{ color: '#000' }}>Ready</option>
                <option value="generating" style={{ color: '#000' }}>Generating (Cooking)</option>
                <option value="scheduled" style={{ color: '#000' }}>Scheduled</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Choice Question (shown at end)</label>
              <input 
                type="text" 
                name="choiceQuestion" 
                value={formData.choiceQuestion || ''} 
                onChange={handleChange} 
                style={inputStyle} 
                placeholder="e.g. Should Rani be eliminated?"
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              name="isSeriesFinale" 
              checked={formData.isSeriesFinale} 
              onChange={handleChange} 
              style={{ width: '18px', height: '18px', accentColor: '#ec4899' }}
            />
            <span style={{ fontSize: '0.9rem', color: '#ec4899', fontWeight: 600 }}>Is Series Finale? (Triggers celebration ending)</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="cyber-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Episode'}
          </button>
        </div>
      </form>
    </div>
  );
}
