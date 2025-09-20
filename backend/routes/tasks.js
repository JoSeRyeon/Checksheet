const express = require('express');
const router = express.Router();
const db = require('../db.js');

// 1. 모든 작업 조회
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        t.id, 
        t.title, 
        t.category, 
        t.checksheet_id AS "checksheetId",
        cs.checksheet_name AS "checksheetName",
        t.creator, 
        to_char(t.created_at, 'YYYY/MM/DD HH24:MI:SS') AS "createdAt",
        to_char(t.updated_at, 'YYYY/MM/DD HH24:MI:SS') AS "updatedAt",
        t.assignee, 
        t.verifier, 
        t.admin
      FROM 
        tasks t
      LEFT JOIN 
        checksheet_list cs
      ON 
        t.checksheet_id = cs.id
      ORDER BY 
        t.created_at DESC;
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '작업 조회 실패' });
  }
});

// 2. 특정 작업 조회
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id=$1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '작업 조회 실패' });
  }
});

// 3. 작업 생성
router.post('/', async (req, res) => {
  const { title, category, checksheet_id, creator, assignee, verifier, admin } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tasks 
      (title, category, checksheet_id, creator, assignee, verifier, admin) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, category, checksheet_id, creator, assignee, verifier, admin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '작업 생성 실패' });
  }
});

// 4. 작업 업데이트
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, checksheetId, creator, assignee, verifier, admin } = req.body;
  try {
    const result = await db.query(
      `UPDATE tasks SET title=$1, category=$2, checksheet_id=$3, creator=$4, assignee=$5, verifier=$6, admin=$7, updated_at=NOW() 
      WHERE id=$8 RETURNING *`,
      [title, category, checksheetId, creator, assignee, verifier, admin, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '작업 수정 실패' });
  }
});

// 5. 작업 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id=$1', [id]);
    res.json({ message: '작업 삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '작업 삭제 실패' });
  }
});

module.exports = router;
