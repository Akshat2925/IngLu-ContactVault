const getInitials = name =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const DETAIL_ROWS = [
  { icon: '✉️', label: 'Email',   key: 'email',   href: v => `mailto:${v}` },
  { icon: '📞', label: 'Phone',   key: 'phone',   href: v => `tel:${v}`    },
  { icon: '📍', label: 'Address', key: 'address', href: null               },
  { icon: '📝', label: 'Notes',   key: 'notes',   href: null               },
]

export default function ContactDetail({ contact, onClose, onEdit, onDelete, onFavorite }) {
  const { _id, name, email, phone, company, role, address, notes, tags, favorite, avatarColor, createdAt } = contact

  return (
    <div style={{
      width:        320,
      flexShrink:   0,
      background:   'var(--mantle)',
      border:       '1px solid var(--surface0)',
      borderRadius: 'var(--radius)',
      padding:      '1.5rem',
      height:       'fit-content',
      position:     'sticky',
      top:          80,
      animation:    'slideIn 0.2s ease',
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px) }
          to   { opacity: 1; transform: translateX(0)    }
        }
      `}</style>

      {/* Top bar — favorite + close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          onClick={() => onFavorite(_id)}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem', opacity: favorite ? 1 : 0.3, cursor: 'pointer' }}
        >
          ⭐
        </button>
        <button
          onClick={onClose}
          style={{ background: 'var(--surface0)', border: 'none', color: 'var(--subtext)', width: 28, height: 28, borderRadius: 7, cursor: 'pointer', fontWeight: 700 }}
        >
          ✕
        </button>
      </div>

      {/* Avatar + Name */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width:          72,
          height:         72,
          borderRadius:   18,
          background:     avatarColor,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontWeight:     800,
          fontSize:       '1.5rem',
          color:          '#fff',
          margin:         '0 auto 0.75rem',
          boxShadow:      `0 8px 24px ${avatarColor}60`,
        }}>
          {getInitials(name)}
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{name}</div>
        {role    && <div style={{ color: 'var(--subtext)', fontSize: '0.85rem', marginTop: 2 }}>{role}</div>}
        {company && <div style={{ color: 'var(--blue)',    fontSize: '0.82rem', marginTop: 2 }}>{company}</div>}
      </div>

      {/* Contact details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {DETAIL_ROWS
          .filter(row => contact[row.key])
          .map(({ icon, label, key, href }) => (
            <div key={key} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.9rem', marginTop: 1 }}>{icon}</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--overlay0)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </div>
                {href ? (
                  <a href={href(contact[key])} style={{ color: 'var(--blue)', fontSize: '0.875rem' }}>
                    {contact[key]}
                  </a>
                ) : (
                  <div style={{ color: 'var(--text)', fontSize: '0.875rem' }}>{contact[key]}</div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              background:   'rgba(137,180,250,0.12)',
              color:        'var(--blue)',
              padding:      '0.2rem 0.6rem',
              borderRadius: 20,
              fontSize:     '0.75rem',
              fontWeight:   600,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Date added */}
      <div style={{ fontSize: '0.75rem', color: 'var(--overlay0)', marginBottom: '1.25rem' }}>
        Added {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>

      {/* Edit / Delete */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onEdit(contact)}
          style={{ flex: 1, background: 'rgba(137,180,250,0.1)', color: 'var(--blue)', border: '1px solid rgba(137,180,250,0.2)', borderRadius: 8, padding: '0.6rem', fontWeight: 600, fontSize: '0.875rem' }}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(_id)}
          style={{ flex: 1, background: 'rgba(243,139,168,0.1)', color: 'var(--red)', border: '1px solid rgba(243,139,168,0.2)', borderRadius: 8, padding: '0.6rem', fontWeight: 600, fontSize: '0.875rem' }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  )
}
