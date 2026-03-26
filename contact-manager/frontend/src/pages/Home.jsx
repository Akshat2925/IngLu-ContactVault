import Stats         from '../components/Stats'
import SearchBar     from '../components/SearchBar'
import ContactCard   from '../components/ContactCard'
import ContactDetail from '../components/ContactDetail'

export default function Home(props) {
  const {
    contacts, loading, stats, tags,
    search, setSearch, filterTag, setFilterTag, sort, setSort,
    selected, setSelected,
    handleDelete, handleBulkDelete, handleFavorite,
    openEdit, openAdd,
    viewContact, setViewContact,
  } = props

  const toggleSelect = id =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtext)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        Loading contacts...
      </div>
    )
  }

  // ─── Empty state ────────────────────────────────────────────────────────────
  const isEmpty = contacts.length === 0

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
      <Stats stats={stats} />

      <SearchBar
        search={search}       setSearch={setSearch}
        filterTag={filterTag} setFilterTag={setFilterTag}
        sort={sort}           setSort={setSort}
        tags={tags}
        selected={selected}   onBulkDelete={handleBulkDelete}
      />

      {isEmpty ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtext)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            No contacts found
          </div>
          <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {search ? 'Try a different search term' : 'Add your first contact to get started'}
          </div>
          {!search && (
            <button
              onClick={openAdd}
              style={{
                background:   'linear-gradient(135deg, var(--blue), var(--mauve))',
                color:        'var(--crust)',
                border:       'none',
                borderRadius: 8,
                padding:      '0.7rem 1.5rem',
                fontWeight:   700,
                cursor:       'pointer',
              }}
            >
              + Add First Contact
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* Contact grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: viewContact
              ? 'repeat(auto-fill, minmax(260px, 1fr))'
              : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap:          '1rem',
            flex:         1,
            alignContent: 'start',
          }}>
            {contacts.map(contact => (
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

          {/* Detail panel */}
          {viewContact && (
            <ContactDetail
              contact={viewContact}
              onClose={() => setViewContact(null)}
              onEdit={openEdit}
              onDelete={handleDelete}
              onFavorite={handleFavorite}
            />
          )}
        </div>
      )}
    </div>
  )
}
