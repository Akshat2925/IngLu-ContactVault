import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL}/api/contacts`

// ─── Field definitions ────────────────────────────────────────────────────────
const FIELDS = [
  { label: 'Full Name *', name: 'name',    type: 'text',  placeholder: 'John Doe',              span: 2 },
  { label: 'Email',       name: 'email',   type: 'email', placeholder: 'john@example.com',       span: 1 },
  { label: 'Phone',       name: 'phone',   type: 'tel',   placeholder: '+1 234 567 8900',        span: 1 },
  { label: 'Company',     name: 'company', type: 'text',  placeholder: 'Acme Corp',              span: 1 },
  { label: 'Role / Title',name: 'role',    type: 'text',  placeholder: 'Software Engineer',      span: 1 },
  { label: 'Address',     name: 'address', type: 'text',  placeholder: '123 Main St, City',      span: 2 },
]

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', role: '', address: '', notes: '', tags: [] }

export default function ContactModal({ contact, onSave, onClose, tags: existingTags }) {
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [tagInput,   setTagInput]   = useState('')
  const [saving,     setSaving]     = useState(false)
  const [dupWarning, setDupWarning] = useState([])
  const dupTimer = useRef(null)

  // Populate form when editing
  useEffect(() => {
    setForm(contact ? { ...contact, tags: contact.tags || [] } : EMPTY_FORM)
    setDupWarning([])
  }, [contact])

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    // Real-time duplicate check (debounced 600ms)
    if (['name', 'email', 'phone'].includes(name)) {
      clearTimeout(dupTimer.current)
      dupTimer.current = setTimeout(async () => {
        try {
          const updated = { ...form, [name]: value }
          const { data } = await axios.post(`${API}/meta/check-duplicate`, {
            name:      updated.name,
            email:     updated.email,
            phone:     updated.phone,
            excludeId: contact?._id,
          })
          setDupWarning(data.duplicates || [])
        } catch { /* silent */ }
      }, 600)
    }
  }

  const addTag = tag => {
    const t = tag.trim().toLowerCase()
    if (t && !form.tags.includes(t)) setForm(prev => ({ ...prev, tags: [...prev.tags, t] }))
    setTagInput('')
  }

  const removeTag = tag => setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0,0,0,0.7)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         200,
        backdropFilter: 'blur(4px)',
        padding:        '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   'var(--mantle)',
          border:       '1px solid var(--surface0)',
          borderRadius: 16,
          padding:      '2rem',
          width:        '100%',
          maxWidth:     560,
          maxHeight:    '90vh',
          overflowY:    'auto',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.6)',
          animation:    'modalIn 0.2s ease',
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px) }
            to   { opacity: 1; transform: scale(1)    translateY(0)    }
          }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>
            {contact ? '✏️ Edit Contact' : '➕ New Contact'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface0)', border: 'none', color: 'var(--subtext)', width: 32, height: 32, borderRadius: 8, fontSize: '1rem', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>

            {/* Standard fields */}
            {FIELDS.map(({ label, name, type, placeholder, span }) => (
              <div key={name} style={{ gridColumn: `span ${span}` }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--subtext)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={form[name] || ''}
                  onChange={handleChange}
                  required={name === 'name'}
                />
              </div>
            ))}

            {/* Notes */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--subtext)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Any additional notes..."
                value={form.notes || ''}
                onChange={handleChange}
                style={{
                  resize:     'vertical',
                  background: 'var(--surface0)',
                  border:     '1px solid var(--surface1)',
                  color:      'var(--text)',
                  borderRadius: 8,
                  padding:    '0.6rem 0.9rem',
                  width:      '100%',
                  fontFamily: 'Inter, sans-serif',
                  fontSize:   '0.9rem',
                  outline:    'none',
                }}
              />
            </div>

            {/* Tags */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--subtext)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Tags
              </label>

              {/* Current tags */}
              {form.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {form.tags.map(tag => (
                    <span key={tag} style={{
                      background:   'rgba(137,180,250,0.15)',
                      color:        'var(--blue)',
                      padding:      '0.2rem 0.6rem',
                      borderRadius: 20,
                      fontSize:     '0.8rem',
                      display:      'flex',
                      alignItems:   'center',
                      gap:          '0.3rem',
                    }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag input + quick-add */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) } }}
                  placeholder="Type a tag and press Enter..."
                />
                {existingTags.filter(t => !form.tags.includes(t)).length > 0 && (
                  <select
                    onChange={e => { if (e.target.value) addTag(e.target.value); e.target.value = '' }}
                    style={{ width: 'auto', minWidth: 120 }}
                  >
                    <option value="">Quick add</option>
                    {existingTags.filter(t => !form.tags.includes(t)).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Duplicate warning */}
          {dupWarning.length > 0 && (
            <div style={{
              background:   'rgba(249,226,175,0.12)',
              border:       '1px solid rgba(249,226,175,0.35)',
              borderRadius: 8,
              padding:      '0.75rem 1rem',
              color:        '#f9e2af',
              fontSize:     '0.85rem',
              marginTop:    '1rem',
            }}>
              ⚠️ Possible duplicate{dupWarning.length > 1 ? 's' : ''} found:{' '}
              <strong>{dupWarning.map(d => d.name).join(', ')}</strong>. You can still save.
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, background: 'var(--surface0)', color: 'var(--subtext)', border: '1px solid var(--surface1)', borderRadius: 8, padding: '0.7rem', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex:         2,
                background:   'linear-gradient(135deg, var(--blue), var(--mauve))',
                color:        'var(--crust)',
                border:       'none',
                borderRadius: 8,
                padding:      '0.7rem',
                fontWeight:   700,
                fontSize:     '0.95rem',
                opacity:      saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : contact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
