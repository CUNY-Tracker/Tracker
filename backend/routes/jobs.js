import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/:role', (req, res) => {
  const {role} = req.params
  const jobs = db.prepare(`SELECT * FROM jobs WHERE role = '${role}'`).all();
  res.status(200).json(jobs);
});

router.post('/', (req, res) => {
  const { company, role, postedBy } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: 'Company and role are required' });
  }
  const result = db
    .prepare('INSERT INTO jobs (company, role, postedBy) VALUES (?, ?, ?)')
    .run(company, role, postedBy || 'student');
  const newJob = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newJob);
});

export default router;
