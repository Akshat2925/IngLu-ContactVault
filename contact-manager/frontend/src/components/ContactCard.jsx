const getInitials = name =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export default function ContactCard({
  contact, onView, onEdit, onDelete, onFavorite, selected, onSelect,
}) {
  const { _id, name, email, phone, role, company, tags, favorite, avatarColor } = contact

  return (
    <div
      onClick={() => onView(contact)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--surface1)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = selected ? 'var(--blue)' : 'var(--surface0)' }}
      style={{
        background:   'var(--mantle)',
        border:       `1px solid ${selected ? 'var(--blue)' : 'var(--surface0)'}`,
        borderRadius: 'var(--radius)',
        padding:      '1.2rem',
        cursor:       'pointer',
        transition:   'all 0.2s',
        position:     'relative',
        boxShadow:    selected ? '0 0 0 2px rgba(137,180,250,0.3)' : 'none',
      }}
    >
      {/* Checkbox */}
      <div
        onClick={e => { e.stopPropagation(); onSelect(_id) }}
        style={{
          position:       'absolute',
          top:            10,
          left:           10,
          width:          18,
          height:         18,
          borderRadius:   5,
          border:         `2px solid ${selected ? 'var(--blue)' : 'var(--surface1)'}`,
          background:     selected ? 'var(--blue)' : 'transparent',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '0.7rem',
          color:          'var(--crust)',
          fontWeight:     700,
          transition:     'all 0.2s',
        }}
      >
        {selected ? '✓' : ''}
      </div>

      {/* Favorite star */}
      <button
        onClick={e => { e.stopPropagation(); onFavorite(_id) }}
        style={{
          position:   'absolute',
          top:        8,
          right:      8,
          background: 'none',
          border:     'none',
          fontSize:   '1rem',
          opacity:    favorite ? 1 : 0.3,
          transition: 'opacity 0.2s',
          padding:    4,
        }}
      >
        ⭐
      </button>

      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem', marginTop: '0.5rem' }}>
        <div style={{
          width:          46,
          height:         46,
          borderRadius:   12,
          background:     avatarColor,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontWeight:     700,
          fontSize:       '1rem',
          color:          '#fff',
          flexShrink:     0,
          boxShadow:      `0 4px 12px ${avatarColor}60`,
        }}>
          {getInitials(name)}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </div>
          {role && (
            <div style={{ fontSize: '0.78rem', color: 'var(--subtext)', marginTop: 1 }}>
              {role}{company ? ` @ ${company}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* Email / Phone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.9rem' }}>
        {email && (
          <div style={{ fontSize: '0.82rem', color: 'var(--subtext)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>✉️</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>
          </div>
        )}
        {phone && (
          <div style={{ fontSize: '0.82rem', color: 'var(--subtext)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📞</span><span>{phone}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              background:   'rgba(137,180,250,0.12)',
              color:        'var(--blue)',
              padding:      '0.15rem 0.55rem',
              borderRadius: 20,
              fontSize:     '0.72rem',
              fontWeight:   600,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Edit / Delete actions */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', gap: '0.5rem', marginTop: '0.9rem', borderTop: '1px solid var(--surface0)', paddingTop: '0.75rem' }}
      >
        <button
          onClick={() => onEdit(contact)}
          style={{
            flex:         1,
            background:   'rgba(137,180,250,0.1)',
            color:        'var(--blue)',
            border:       '1px solid rgba(137,180,250,0.2)',
            borderRadius: 7,
            padding:      '0.4rem',
            fontSize:     '0.8rem',
            fontWeight:   600,
          }}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(_id)}
          style={{
            flex:         1,
            background:   'rgba(243,139,168,0.1)',
            color:        'var(--red)',
            border:       '1px solid rgba(243,139,168,0.2)',
            borderRadius: 7,
            padding:      '0.4rem',
            fontSize:     '0.8rem',
            fontWeight:   600,
          }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  )
}
