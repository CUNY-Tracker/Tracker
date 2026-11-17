import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/jobs -> all jobs, newest first (homepage)
router.get('/', (req, res) => {
  const jobs = db
    .prepare('SELECT * FROM jobs ORDER BY createdAt DESC, id DESC')
    .all();
  res.status(200).json(jobs);
});

// GET /api/jobs/:role -> safe search with partial matches
router.get('/:role', (req, res) => {
  const keyword = req.params.role.trim();
  const escaped = keyword.replace(/[\\%_]/g, (char) => '\\' + char);

  const jobs = db
    .prepare(
      `SELECT * FROM jobs
       WHERE role LIKE ? ESCAPE '\\'
       ORDER BY createdAt DESC, id DESC`
    )
    .all(`%${escaped}%`);

  res.status(200).json(jobs);
});

// POST /api/jobs -> add a new job
router.post('/', (req, res) => {
  const { company, role, postedBy, deadline, description, applicationLink } =
    req.body;

  if (!company?.trim() || !role?.trim()) {
    return res.status(400).json({ error: 'Company and role are required' });
  }

  const result = db
    .prepare(
      `INSERT INTO jobs (company, role, postedBy, deadline, description, applicationLink)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      company.trim(),
      role.trim(),
      postedBy?.trim() || 'student',
      deadline || null,
      description?.trim() || null,
      applicationLink?.trim() || null
    );

  const newJob = db
    .prepare('SELECT * FROM jobs WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(newJob);
});

export default router;