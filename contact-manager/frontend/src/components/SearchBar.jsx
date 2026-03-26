export default function SearchBar({
  search, setSearch,
  filterTag, setFilterTag,
  sort, setSort,
  tags,
  selected, onBulkDelete,
}) {
  return (
    <div style={{
      display:     'flex',
      gap:         '0.75rem',
      marginBottom: '1.5rem',
      flexWrap:    'wrap',
      alignItems:  'center',
    }}>
      {/* Search input */}
      <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
        <span style={{
          position:  'absolute',
          left:      '0.75rem',
          top:       '50%',
          transform: 'translateY(-50%)',
          color:     'var(--overlay0)',
          fontSize:  '0.9rem',
          pointerEvents: 'none',
        }}>
          🔍
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, company..."
          style={{ paddingLeft: '2.2rem' }}
        />
      </div>

      {/* Tag filter */}
      <select
        value={filterTag}
        onChange={e => setFilterTag(e.target.value)}
        style={{ width: 'auto', minWidth: 130 }}
      >
        <option value="">All Tags</option>
        {tags.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={e => setSort(e.target.value)}
        style={{ width: 'auto', minWidth: 130 }}
      >
        <option value="name">Sort: Name</option>
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
      </select>

      {/* Bulk delete */}
      {selected.length > 0 && (
        <button
          onClick={onBulkDelete}
          style={{
            background:   'rgba(243,139,168,0.15)',
            color:        'var(--red)',
            border:       '1px solid rgba(243,139,168,0.3)',
            borderRadius: 8,
            padding:      '0.6rem 1rem',
            fontWeight:   600,
            fontSize:     '0.875rem',
          }}
        >
          🗑 Delete {selected.length}
        </button>
      )}
    </div>
  )
}
