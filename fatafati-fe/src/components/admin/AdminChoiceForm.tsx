'use client';

import React, { useState } from 'react';
import { EpisodeChoice } from '@fatafati/common';
import { Save, Trash2, Plus, GitMerge } from 'lucide-react';

interface AdminChoiceFormProps {
  episodeId: string;
  choices: EpisodeChoice[];
  onSave: (choice: Partial<EpisodeChoice> & { episodeId: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AdminChoiceForm({ episodeId, choices, onSave, onDelete }: AdminChoiceFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EpisodeChoice>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEdit = (choice: EpisodeChoice) => {
    setEditingId(choice.id);
    setFormData({ ...choice });
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      label: 'YES',
      text: '',
      targetEpisodeId: '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ ...formData, episodeId } as Partial<EpisodeChoice> & { episodeId: string });
      cancelEdit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.85rem',
    marginBottom: '12px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitMerge size={18} color="#a855f7" /> Branching Choices
        </h3>
        {!editingId && (
          <button 
            onClick={startNew}
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              color: '#d8b4fe',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <Plus size={16} /> Add Choice
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {choices.map(choice => (
          <div key={choice.id}>
            {editingId === choice.id ? (
              // Edit Form Inline
              <form onSubmit={handleSubmit} className="cyber-panel" style={{ padding: '16px', background: 'rgba(15, 20, 30, 0.9)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '120px' }}>
                    <label style={labelStyle}>Label</label>
                    <input type="text" name="label" value={formData.label || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. YES" required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Action Text</label>
                    <input type="text" name="text" value={formData.text || ''} onChange={handleChange} style={inputStyle} placeholder="Full description" required />
                  </div>
                </div>
                <label style={labelStyle}>Target Episode ID</label>
                <input type="text" name="targetEpisodeId" value={formData.targetEpisodeId || ''} onChange={handleChange} style={inputStyle} placeholder="UUID of the next episode" required />
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button type="button" onClick={cancelEdit} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="cyber-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Save</button>
                </div>
              </form>
            ) : (
              // Display Row
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    <span style={{ color: '#00f0ff', marginRight: '8px' }}>{choice.label}</span>
                    {choice.text}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    → Targets: {choice.targetEpisodeId}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEdit(choice)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                  <button onClick={() => { if(confirm('Delete choice?')) onDelete(choice.id); }} style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', color: '#ec4899', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New Form */}
        {editingId === 'new' && (
          <form onSubmit={handleSubmit} className="cyber-panel" style={{ padding: '16px', background: 'rgba(15, 20, 30, 0.9)' }}>
            <h4 style={{ color: '#fff', marginTop: 0, marginBottom: '16px' }}>Add New Choice</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '120px' }}>
                <label style={labelStyle}>Label</label>
                <input type="text" name="label" value={formData.label || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. YES" required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Action Text</label>
                <input type="text" name="text" value={formData.text || ''} onChange={handleChange} style={inputStyle} placeholder="Full description" required />
              </div>
            </div>
            <label style={labelStyle}>Target Episode ID</label>
            <input type="text" name="targetEpisodeId" value={formData.targetEpisodeId || ''} onChange={handleChange} style={inputStyle} placeholder="UUID of the next episode" required />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button type="button" onClick={cancelEdit} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="cyber-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Create</button>
            </div>
          </form>
        )}

        {choices.length === 0 && editingId !== 'new' && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '4px' }}>
            No branching choices configured.
          </div>
        )}
      </div>
    </div>
  );
}
