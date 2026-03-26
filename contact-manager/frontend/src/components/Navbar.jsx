import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { path: '/',           label: 'All Contacts' },
  { path: '/favorites',  label: '⭐ Favorites'  },
  { path: '/activity',   label: '📋 Activity'   },
  { path: '/duplicates', label: '🔍 Duplicates' },
]

export default function Navbar({ openAdd, stats }) {
  const { pathname } = useLocation()

  return (
    <nav style={{
      background:     'var(--mantle)',
      borderBottom:   '1px solid var(--surface0)',
      padding:        '0 2rem',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      height:         '64px',
      position:       'sticky',
      top:            0,
      zIndex:         100,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Left — Logo + Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width:      32,
            height:     32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--blue), var(--mauve))',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize:   '1rem',
          }}>📇</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
            Contact<span style={{ color: 'var(--blue)' }}>Vault</span>
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                padding:    '0.4rem 0.9rem',
                borderRadius: 8,
                fontSize:   '0.875rem',
                fontWeight: 500,
                color:      pathname === path ? 'var(--blue)' : 'var(--subtext)',
                background: pathname === path ? 'rgba(137,180,250,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right — Contact count + Add button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'var(--subtext)', fontSize: '0.85rem' }}>
          {stats.total} contact{stats.total !== 1 ? 's' : ''}
        </span>
        <button
          onClick={openAdd}
          style={{
            background:  'linear-gradient(135deg, var(--blue), var(--mauve))',
            color:       'var(--crust)',
            border:      'none',
            borderRadius: 8,
            padding:     '0.5rem 1.1rem',
            fontWeight:  700,
            fontSize:    '0.875rem',
            display:     'flex',
            alignItems:  'center',
            gap:         '0.4rem',
            boxShadow:   '0 2px 12px rgba(137,180,250,0.3)',
            transition:  'opacity 0.2s',
          }}
        >
          + Add Contact
        </button>
      </div>
    </nav>
  )
}
