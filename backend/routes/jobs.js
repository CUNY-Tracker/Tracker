import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/jobs -> all jobs, newest first (homepage)
router.get('/', async (req, res, next) => {
  try {
    const result = await db.execute(
      'SELECT * FROM jobs ORDER BY createdAt DESC, id DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:role -> safe search with partial matches
router.get('/:role', async (req, res, next) => {
  try {
    const keyword = req.params.role.trim();
    const escaped = keyword.replace(/[\\%_]/g, (char) => '\\' + char);

    const result = await db.execute({
      sql: `SELECT * FROM jobs
            WHERE role LIKE ? ESCAPE '\\'
            ORDER BY createdAt DESC, id DESC`,
      args: [`%${escaped}%`],
    });
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs -> add a new job
router.post('/', async (req, res, next) => {
  try {
    const { company, role, postedBy, deadline, description, applicationLink } =
      req.body;

    if (!company?.trim() || !role?.trim()) {
      return res.status(400).json({ error: 'Company and role are required' });
    }

    const insert = await db.execute({
      sql: `INSERT INTO jobs (company, role, postedBy, deadline, description, applicationLink)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        company.trim(),
        role.trim(),
        postedBy?.trim() || 'student',
        deadline || null,
        description?.trim() || null,
        applicationLink?.trim() || null,
      ],
    });

    const newJob = await db.execute({
      sql: 'SELECT * FROM jobs WHERE id = ?',
      args: [insert.lastInsertRowid],
    });
    res.status(201).json(newJob.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;