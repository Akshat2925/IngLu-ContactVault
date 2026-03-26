import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = `${import.meta.env.VITE_API_URL}/api/contacts`

// ─── Constants ────────────────────────────────────────────────────────────────

const MATCH_LABELS = {
  email: '✉️ Same Email',
  phone: '📞 Same Phone',
  name:  '👤 Same Name',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = name =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

// ─── Sub-component: Mini contact card ────────────────────────────────────────

function MiniCard({ contact }) {
  return (
    <div style={{ background: 'var(--surface0)', borderRadius: 10, padding: '1rem', flex: 1 }}>
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width:          40,
          height:         40,
          borderRadius:   10,
          background:     contact.avatarColor,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontWeight:     700,
          color:          '#fff',
          fontSize:       '0.9rem',
          flexShrink:     0,
        }}>
          {getInitials(contact.name)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{contact.name}</div>
          {contact.role && <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>{contact.role}</div>}
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {contact.email   && <div style={{ fontSize: '0.8rem', color: 'var(--subtext)' }}>✉️ {contact.email}</div>}
        {contact.phone   && <div style={{ fontSize: '0.8rem', color: 'var(--subtext)' }}>📞 {contact.phone}</div>}
        {contact.company && <div style={{ fontSize: '0.8rem', color: 'var(--subtext)' }}>🏢 {contact.company}</div>}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--overlay0)', marginTop: '0.5rem' }}>
        Added {new Date(contact.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Duplicates({ onRefresh }) {
  const [duplicates, setDuplicates] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [deleting,   setDeleting]   = useState(null)

  const fetchDuplicates = () => {
    setLoading(true)
    axios.get(`${API}/meta/duplicates`)
      .then(r => setDuplicates(r.data.duplicates))
      .catch(() => toast.error('Failed to load duplicates'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDuplicates() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    setDeleting(id)
    try {
      await axios.delete(`${API}/${id}`)
      toast.success(`"${name}" deleted`)
      fetchDuplicates()
      onRefresh()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>🔍 Duplicate Contacts</h2>
        <p style={{ color: 'var(--subtext)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Contacts sharing the same name, email, or phone number
        </p>
      </div>

      {/* States */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtext)' }}>⏳ Scanning...</div>
      ) : duplicates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtext)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>No duplicates found</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>All your contacts look unique</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Warning banner */}
          <div style={{
            background:   'rgba(249,226,175,0.1)',
            border:       '1px solid rgba(249,226,175,0.3)',
            borderRadius: 10,
            padding:      '0.75rem 1rem',
            color:        '#f9e2af',
            fontSize:     '0.875rem',
            fontWeight:   600,
          }}>
            ⚠️ Found {duplicates.length} duplicate pair{duplicates.length !== 1 ? 's' : ''}.
            Review and delete the one you don't need.
          </div>

          {/* Duplicate pairs */}
          {duplicates.map(([a, b, matchType], i) => (
            <div
              key={i}
              style={{
                background:   'var(--mantle)',
                border:       '1px solid var(--surface0)',
                borderRadius: 12,
                padding:      '1.25rem',
              }}
            >
              {/* Match reason */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                  background:   'rgba(243,139,168,0.15)',
                  color:        'var(--red)',
                  padding:      '0.2rem 0.7rem',
                  borderRadius: 20,
                  fontSize:     '0.78rem',
                  fontWeight:   700,
                }}>
                  {MATCH_LABELS[matchType] || '⚠️ Duplicate'}
                </span>
                <span style={{ color: 'var(--overlay0)', fontSize: '0.8rem' }}>Pair #{i + 1}</span>
              </div>

              {/* Side-by-side cards */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <MiniCard contact={a} />
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--overlay0)', fontSize: '1.2rem', flexShrink: 0 }}>
                  ⟷
                </div>
                <MiniCard contact={b} />
              </div>

              {/* Delete actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[a, b].map(contact => (
                  <button
                    key={contact._id}
                    onClick={() => handleDelete(contact._id, contact.name)}
                    disabled={deleting === contact._id}
                    style={{
                      background:   'rgba(243,139,168,0.1)',
                      color:        'var(--red)',
                      border:       '1px solid rgba(243,139,168,0.25)',
                      borderRadius: 8,
                      padding:      '0.5rem 1rem',
                      fontWeight:   600,
                      fontSize:     '0.85rem',
                      cursor:       'pointer',
                      opacity:      deleting === contact._id ? 0.5 : 1,
                    }}
                  >
                    🗑 Delete "{contact.name}"
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
