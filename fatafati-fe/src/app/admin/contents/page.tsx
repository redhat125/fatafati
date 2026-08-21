'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/apiClient';
import { Series, Episode, EpisodeChoice } from '@fatafati/common';
import { AdminSeriesForm } from '@/components/admin/AdminSeriesForm';
import { AdminEpisodeList } from '@/components/admin/AdminEpisodeList';
import { AdminEpisodeForm } from '@/components/admin/AdminEpisodeForm';
import { AdminChoiceForm } from '@/components/admin/AdminChoiceForm';

export default function AdminContentsPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [isCreatingSeries, setIsCreatingSeries] = useState(false);
  
  // Episode State
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [isCreatingEpisode, setIsCreatingEpisode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSeries();
  }, []);

  useEffect(() => {
    if (selectedSeriesId) {
      loadEpisodes(selectedSeriesId);
    } else {
      setEpisodes([]);
      setSelectedEpisodeId(null);
      setIsCreatingEpisode(false);
    }
  }, [selectedSeriesId]);

  const loadSeries = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSeries();
      setSeriesList(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpisodes = async (seriesId: string) => {
    try {
      // The easiest way to get all episodes for a series is to get the story tree
      const graph = await api.getStoryGraph(seriesId);
      const epIds = graph.nodes.map(n => n.id);
      const fullEps = await Promise.all(epIds.map(id => api.getEpisode(id).then(res => res.episode)));
      setEpisodes(fullEps);
    } catch (err: any) {
      console.error(err);
      // Fallback or handle error
      setError("Failed to load episodes.");
    }
  };

  // Series Handlers
  const handleSaveSeries = async (seriesData: Partial<Series>) => {
    try {
      const saved = await api.upsertSeries(seriesData);
      await loadSeries();
      setSelectedSeriesId(saved.id);
      setIsCreatingSeries(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSeries = async (id: string) => {
    try {
      await api.deleteSeries(id);
      setSelectedSeriesId(null);
      await loadSeries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Episode Handlers
  const handleSaveEpisode = async (episodeData: Partial<Episode>) => {
    try {
      const saved = await api.upsertEpisode({ ...episodeData, seriesId: selectedSeriesId! });
      await loadEpisodes(selectedSeriesId!);
      setSelectedEpisodeId(saved.id);
      setIsCreatingEpisode(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteEpisode = async (id: string) => {
    try {
      await api.deleteEpisode(id);
      setSelectedEpisodeId(null);
      await loadEpisodes(selectedSeriesId!);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Choice Handlers
  const handleSaveChoice = async (choiceData: Partial<EpisodeChoice> & { episodeId: string }) => {
    try {
      await api.upsertChoice(choiceData);
      // Reload episodes to get updated choices
      await loadEpisodes(selectedSeriesId!);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteChoice = async (id: string) => {
    try {
      await api.deleteChoice(id);
      await loadEpisodes(selectedSeriesId!);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const selectedSeries = seriesList.find(s => s.id === selectedSeriesId);
  const selectedEpisode = episodes.find(e => e.id === selectedEpisodeId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-space)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar: Series List */}
        <aside style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', background: 'rgba(10, 15, 25, 0.5)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-cyber-glow" style={{ margin: 0, fontSize: '1.2rem', color: '#00f0ff' }}>Plotplay Admin</h2>
          </div>
          
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Series</span>
            <button 
              className="cyber-btn" 
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              onClick={() => {
                setSelectedSeriesId(null);
                setIsCreatingSeries(true);
              }}
            >
              + New
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {seriesList.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSeriesId(s.id);
                      setIsCreatingSeries(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      background: selectedSeriesId === s.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${selectedSeriesId === s.id ? '#00f0ff' : 'transparent'}`,
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: selectedSeriesId === s.id ? 600 : 400,
                    }}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <section style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {error && (
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          {!selectedSeriesId && !isCreatingSeries && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '16px' }}>
              <div className="text-cyber-glow" style={{ fontSize: '2rem', color: '#00f0ff', opacity: 0.5 }}>SELECT A SERIES</div>
              <p>Choose a series from the sidebar or create a new one to manage its content.</p>
            </div>
          )}

          {isCreatingSeries && (
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <AdminSeriesForm series={{}} onSave={handleSaveSeries} />
            </div>
          )}

          {selectedSeries && !isCreatingSeries && (
            <>
              {/* Series Details Header */}
              <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <AdminSeriesForm 
                    series={selectedSeries} 
                    onSave={handleSaveSeries} 
                    onDelete={handleDeleteSeries} 
                  />
                </div>
              </div>

              {/* Episodes Area */}
              <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                {/* Episode List */}
                <div style={{ width: '320px', flexShrink: 0 }}>
                  <AdminEpisodeList 
                    episodes={episodes} 
                    selectedEpisodeId={selectedEpisodeId} 
                    onSelect={(id) => {
                      setSelectedEpisodeId(id);
                      setIsCreatingEpisode(false);
                    }}
                    onNewEpisode={() => {
                      setSelectedEpisodeId(null);
                      setIsCreatingEpisode(true);
                    }}
                  />
                </div>

                {/* Episode Editor */}
                <div style={{ flex: 1 }}>
                  {!selectedEpisodeId && !isCreatingEpisode && (
                    <div className="cyber-panel" style={{ height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      Select an episode to edit its details and choices.
                    </div>
                  )}

                  {isCreatingEpisode && (
                    <AdminEpisodeForm 
                      episode={{ seriesId: selectedSeries.id }} 
                      onSave={handleSaveEpisode} 
                    />
                  )}

                  {selectedEpisode && !isCreatingEpisode && (
                    <div>
                      <AdminEpisodeForm 
                        episode={selectedEpisode} 
                        onSave={handleSaveEpisode} 
                        onDelete={handleDeleteEpisode}
                      />
                      
                      <AdminChoiceForm 
                        episodeId={selectedEpisode.id}
                        choices={selectedEpisode.choices || []}
                        onSave={handleSaveChoice}
                        onDelete={handleDeleteChoice}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
