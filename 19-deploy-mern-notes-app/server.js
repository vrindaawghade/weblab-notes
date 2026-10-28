require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/weblab_notes';

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));   // set CLIENT_URL when frontend is hosted separately
app.use(express.json());

const Note = mongoose.model('Note', new mongoose.Schema({ title: { type: String, required: true }, content: String }, { timestamps: true }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/notes', async (req, res) => res.json(await Note.find().sort({ createdAt: -1 })));

app.post('/api/notes', async (req, res) => {
  try { res.status(201).json(await Note.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const doc = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    doc ? res.json(doc) : res.status(404).json({ error: 'Not found' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const doc = await Note.findByIdAndDelete(req.params.id);
    doc ? res.json({ deleted: true }) : res.status(404).json({ error: 'Not found' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// React frontend (served from /public)
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`MongoDB connected. App running on port ${PORT}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
