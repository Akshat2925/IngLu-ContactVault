const STAT_ITEMS = [
  { key: 'total',     label: 'Total',      color: 'var(--blue)',   icon: '👥' },
  { key: 'favorites', label: 'Favorites',  color: 'var(--yellow)', icon: '⭐' },
  { key: 'withEmail', label: 'With Email', color: 'var(--green)',  icon: '✉️' },
  { key: 'withPhone', label: 'With Phone', color: 'var(--mauve)',  icon: '📞' },
]

export default function Stats({ stats }) {
  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap:                 '1rem',
      marginBottom:        '1.5rem',
    }}>
      {STAT_ITEMS.map(({ key, label, color, icon }) => (
        <div
          key={key}
          style={{
            background:   'var(--mantle)',
            border:       '1px solid var(--surface0)',
            borderRadius: 'var(--radius)',
            padding:      '1.2rem',
            display:      'flex',
            alignItems:   'center',
            gap:          '1rem',
          }}
        >
          <div style={{
            width:          44,
            height:         44,
            borderRadius:   10,
            background:     `${color}20`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '1.3rem',
          }}>
            {icon}
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>
              {stats[key]}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--subtext)', marginTop: 2 }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
