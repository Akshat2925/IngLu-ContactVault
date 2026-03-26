import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

import Navbar       from './components/Navbar'
import ContactModal from './components/ContactModal'
import Home         from './pages/Home'
import Favorites    from './pages/Favorites'
import ActivityLog  from './pages/ActivityLog'
import Duplicates   from './pages/Duplicates'

const API = 'https://inglu-contactvault.onrender.com/api/contacts'

export default function App() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [contacts,    setContacts]    = useState([])
  const [stats,       setStats]       = useState({ total: 0, favorites: 0, withEmail: 0, withPhone: 0 })
  const [tags,        setTags]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [filterTag,   setFilterTag]   = useState('')
  const [sort,        setSort]        = useState('name')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editContact, setEditContact] = useState(null)
  const [selected,    setSelected]    = useState([])
  const [viewContact, setViewContact] = useState(null)

  // ─── Data Fetching ───────────────────────────────────────────────────────────
  const fetchContacts = useCallback(async () => {
    try {
      const params = { search, sort }
      if (filterTag) params.tag = filterTag
      const { data } = await axios.get(API, { params })
      setContacts(data.contacts)
    } catch {
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }, [search, sort, filterTag])

  const fetchMeta = useCallback(async () => {
    try {
      const [statsRes, tagsRes] = await Promise.all([
        axios.get(`${API}/meta/stats`),
        axios.get(`${API}/meta/tags`),
      ])
      setStats(statsRes.data.stats)
      setTags(tagsRes.data.tags)
    } catch { /* silent */ }
  }, [])

  useEffect(() => { fetchContacts() }, [fetchContacts])
  useEffect(() => { fetchMeta() },     [contacts, fetchMeta])

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSave = async (formData) => {
    try {
      if (editContact) {
        await axios.put(`${API}/${editContact._id}`, formData)
        toast.success('Contact updated!')
      } else {
        await axios.post(API, formData)
        toast.success('Contact added!')
      }
      closeModal()
      fetchContacts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return
    try {
      await axios.delete(`${API}/${id}`)
      toast.success('Contact deleted')
      setViewContact(null)
      fetchContacts()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} contacts?`)) return
    try {
      await axios.delete(API, { data: { ids: selected } })
      toast.success(`${selected.length} contacts deleted`)
      setSelected([])
      fetchContacts()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleFavorite = async (id) => {
    try {
      const { data } = await axios.patch(`${API}/${id}/favorite`)
      setContacts(prev => prev.map(c => c._id === id ? data.contact : c))
      if (viewContact?._id === id) setViewContact(data.contact)
    } catch {
      toast.error('Failed to update')
    }
  }

  const openAdd = () => {
    setEditContact(null)
    setModalOpen(true)
  }

  const openEdit = (contact) => {
    setEditContact(contact)
    setViewContact(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditContact(null)
  }

  // ─── Shared props passed to pages ────────────────────────────────────────────
  const sharedProps = {
    contacts, loading, stats, tags,
    search, setSearch, filterTag, setFilterTag, sort, setSort,
    selected, setSelected,
    handleDelete, handleBulkDelete, handleFavorite,
    openEdit, openAdd,
    viewContact, setViewContact,
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--base)' }}>
      <Navbar openAdd={openAdd} stats={stats} />

      <Routes>
        <Route path="/"           element={<Home      {...sharedProps} />} />
        <Route path="/favorites"  element={<Favorites {...sharedProps} />} />
        <Route path="/activity"   element={<ActivityLog />} />
        <Route path="/duplicates" element={<Duplicates onRefresh={fetchContacts} />} />
      </Routes>

      {modalOpen && (
        <ContactModal
          contact={editContact}
          onSave={handleSave}
          onClose={closeModal}
          tags={tags}
        />
      )}
    </div>
  )
}
