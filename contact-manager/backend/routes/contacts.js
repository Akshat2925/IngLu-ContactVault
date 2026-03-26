const express    = require('express');
const router     = express.Router();
const Contact    = require('../models/Contact');
const ActivityLog = require('../models/ActivityLog');

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#0ea5e9', '#3b82f6',
];

const SORT_MAP = {
  name:   { name: 1 },
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
};

const TRACKED_FIELDS = ['name', 'email', 'phone', 'company', 'role', 'address', 'notes', 'tags'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Non-blocking activity logger */
const log = async (contactId, contactName, action, details = '') => {
  try {
    await ActivityLog.create({ contactId, contactName, action, details });
  } catch (_) { /* intentionally silent */ }
};

const randomColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

// ─── Contacts CRUD ────────────────────────────────────────────────────────────

// GET /api/contacts — list with search, tag filter, sort
router.get('/', async (req, res) => {
  try {
    const { search, tag, favorite, sort = 'name' } = req.query;
    const query = {};

    if (search) {
      query.$or = ['name', 'email', 'phone', 'company'].map(field => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }
    if (tag)              query.tags     = tag;
    if (favorite === 'true') query.favorite = true;

    const contacts = await Contact.find(query).sort(SORT_MAP[sort] ?? SORT_MAP.name);
    res.json({ success: true, contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contacts/:id — single contact (also logs a view)
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    await log(contact._id, contact.name, 'viewed');
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/contacts — create
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create({ ...req.body, avatarColor: randomColor() });
    await log(contact._id, contact.name, 'created', `Email: ${contact.email || 'N/A'}`);
    res.status(201).json({ success: true, contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/contacts/:id — update (tracks changed fields)
router.put('/:id', async (req, res) => {
  try {
    const existing = await Contact.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Contact not found' });

    const changed = TRACKED_FIELDS.filter(
      f => JSON.stringify(existing[f]) !== JSON.stringify(req.body[f])
    );

    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const details = changed.length ? `Changed: ${changed.join(', ')}` : 'No fields changed';
    await log(contact._id, contact.name, 'updated', details);
    res.json({ success: true, contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/contacts/:id/favorite — toggle favorite
router.patch('/:id/favorite', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

    contact.favorite = !contact.favorite;
    await contact.save();
    await log(contact._id, contact.name, contact.favorite ? 'favorited' : 'unfavorited');
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contacts/:id — delete one
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    await log(contact._id, contact.name, 'deleted');
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contacts — bulk delete
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    const contacts = await Contact.find({ _id: { $in: ids } });
    await Contact.deleteMany({ _id: { $in: ids } });
    await Promise.all(contacts.map(c => log(c._id, c.name, 'deleted')));
    res.json({ success: true, message: `${ids.length} contacts deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Meta Endpoints ───────────────────────────────────────────────────────────

// GET /api/contacts/meta/tags — all unique tags
router.get('/meta/tags', async (_req, res) => {
  try {
    const tags = await Contact.distinct('tags');
    res.json({ success: true, tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contacts/meta/stats — dashboard counts
router.get('/meta/stats', async (_req, res) => {
  try {
    const [total, favorites, withEmail, withPhone] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ favorite: true }),
      Contact.countDocuments({ email: { $ne: '' } }),
      Contact.countDocuments({ phone: { $ne: '' } }),
    ]);
    res.json({ success: true, stats: { total, favorites, withEmail, withPhone } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contacts/meta/activity — last 50 activity logs
router.get('/meta/activity', async (_req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contacts/meta/duplicates — find duplicate pairs
router.get('/meta/duplicates', async (_req, res) => {
  try {
    const contacts = await Contact.find();
    const seen      = {};
    const duplicates = [];

    for (const c of contacts) {
      const keys = [
        c.email ? `email:${c.email.toLowerCase()}` : null,
        c.phone ? `phone:${c.phone.replace(/\s+/g, '')}` : null,
        c.name  ? `name:${c.name.toLowerCase().trim()}` : null,
      ].filter(Boolean);

      for (const key of keys) {
        if (seen[key]) {
          const alreadyAdded = duplicates.some(
            ([a, b]) =>
              (a._id.equals(seen[key]._id) && b._id.equals(c._id)) ||
              (b._id.equals(seen[key]._id) && a._id.equals(c._id))
          );
          if (!alreadyAdded) duplicates.push([seen[key], c, key.split(':')[0]]);
        } else {
          seen[key] = c;
        }
      }
    }

    res.json({ success: true, duplicates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/contacts/meta/check-duplicate — real-time check while typing
router.post('/meta/check-duplicate', async (req, res) => {
  try {
    const { name, email, phone, excludeId } = req.body;
    const orQuery = [];

    if (email) orQuery.push({ email: email.toLowerCase().trim() });
    if (phone) orQuery.push({ phone: phone.replace(/\s+/g, '') });
    if (name)  orQuery.push({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });

    if (!orQuery.length) return res.json({ success: true, duplicates: [] });

    const query = { $or: orQuery };
    if (excludeId) query._id = { $ne: excludeId };

    const found = await Contact.find(query);
    res.json({ success: true, duplicates: found });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
