const express = require('express');
const router = express.Router();
const db = require('../db.js');

// 코드 마스터 불러오기
router.get('/', async (req, res) => {
  try {
    const category = req.query.category; // 쿼리에서 가져옴
    const query = `
      SELECT 
        id, category, code, name, color
      FROM
        code_master
      WHERE
        category = $1; `

    const result = await db.query(query, [category]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  } finally {
  }
});


module.exports = router;
