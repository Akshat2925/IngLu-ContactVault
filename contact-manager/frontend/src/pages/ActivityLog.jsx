import { useEffect, useState } from 'react'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL}/api/contacts`

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_STYLES = {
  created:     { color: '#a6e3a1', bg: 'rgba(166,227,161,0.12)', icon: '➕' },
  updated:     { color: '#89b4fa', bg: 'rgba(137,180,250,0.12)', icon: '✏️' },
  deleted:     { color: '#f38ba8', bg: 'rgba(243,139,168,0.12)', icon: '🗑' },
  viewed:      { color: '#94e2d5', bg: 'rgba(148,226,213,0.12)', icon: '👁' },
  favorited:   { color: '#f9e2af', bg: 'rgba(249,226,175,0.12)', icon: '⭐' },
  unfavorited: { color: '#6c7086', bg: 'rgba(108,112,134,0.12)', icon: '☆'  },
}

const FILTER_OPTIONS = ['all', 'created', 'updated', 'deleted', 'viewed', 'favorited']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivityLog() {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    axios.get(`${API}/meta/activity`)
      .then(r => setLogs(r.data.logs))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action === filter)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>📋 Activity Log</h2>
        <p style={{ color: 'var(--subtext)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Track all changes made to your contacts
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {FILTER_OPTIONS.map(f => {
          const style = ACTION_STYLES[f]
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:      '0.35rem 0.9rem',
                borderRadius: 20,
                border:       'none',
                fontWeight:   600,
                fontSize:     '0.8rem',
                cursor:       'pointer',
                background:   active ? (style?.bg || 'rgba(137,180,250,0.2)') : 'var(--surface0)',
                color:        active ? (style?.color || 'var(--blue)')         : 'var(--subtext)',
                transition:   'all 0.2s',
              }}
            >
              {style?.icon || '📋'} {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtext)' }}>⏳ Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtext)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
          No activity yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map(entry => {
            const style = ACTION_STYLES[entry.action] || ACTION_STYLES.updated
            return (
              <div
                key={entry._id}
                style={{
                  background:   'var(--mantle)',
                  border:       '1px solid var(--surface0)',
                  borderRadius: 10,
                  padding:      '0.9rem 1.1rem',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '1rem',
                }}
              >
                {/* Action icon */}
                <div style={{
                  width:          36,
                  height:         36,
                  borderRadius:   9,
                  background:     style.bg,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '1rem',
                  flexShrink:     0,
                }}>
                  {style.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{entry.contactName}</span>
                    <span style={{
                      background:   style.bg,
                      color:        style.color,
                      padding:      '0.1rem 0.5rem',
                      borderRadius: 20,
                      fontSize:     '0.75rem',
                      fontWeight:   600,
                    }}>
                      {entry.action}
                    </span>
                  </div>
                  {entry.details && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--subtext)', marginTop: '0.2rem' }}>
                      {entry.details}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div style={{ fontSize: '0.78rem', color: 'var(--overlay0)', flexShrink: 0 }}>
                  {timeAgo(entry.createdAt)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
