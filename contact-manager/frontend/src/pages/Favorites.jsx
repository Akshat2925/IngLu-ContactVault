import ContactCard from '../components/ContactCard'

export default function Favorites({ contacts, handleDelete, handleFavorite, openEdit, setViewContact, selected, setSelected }) {
  const favorites = contacts.filter(c => c.favorite)

  const toggleSelect = id =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>⭐ Favorites</h2>
        <p style={{ color: 'var(--subtext)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {favorites.length} favorite contact{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Empty state */}
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtext)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>No favorites yet</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Click the star on any contact to add it here
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {favorites.map(contact => (
            <ContactCard
              key={contact._id}
              contact={contact}
              onView={setViewContact}
              onEdit={openEdit}
              onDelete={handleDelete}
              onFavorite={handleFavorite}
              selected={selected.includes(contact._id)}
              onSelect={toggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
