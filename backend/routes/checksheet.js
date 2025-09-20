const express = require('express');
const router = express.Router();
const db = require('../db.js');

// 체크시트 리스트 불러오기
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
      c.id
      , c.category
      , c.checksheet_name As "checksheetName"
      , c.status::character varying
      , cm.name AS "statusLabel"
      , cm.color AS "statusColor"
      , c.author
      , TO_CHAR(created_at, 'YYYY/MM/DD HH24:MI:SS') AS "createdAt"
      , TO_CHAR(updated_at, 'YYYY/MM/DD HH24:MI:SS') AS "updatedAt"
      FROM checksheet_list c
      LEFT JOIN code_master cm
      ON c.status::character varying = cm.code
      AND cm.category = 'checksheet_status'
      ORDER BY c.status ASC, c.updated_at DESC;
    `
    const result = await db.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  } finally {
  }
});

// 특정 체크시트 정보 취득
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. 시트 정보
    const sheetResult = await db.query(
      `SELECT id, checksheet_name, category 
         FROM checksheet_list 
        WHERE id = $1`,
      [id]
    );
    if (sheetResult.rows.length === 0) {
      return res.status(404).json({ error: 'not found' });
    }
    const sheet = sheetResult.rows[0];

    // 2. 섹션들
    const sectionsResult = await db.query(
      `SELECT id, title, text, sort_order 
         FROM checksheet_section 
        WHERE checksheet_id = $1 
        ORDER BY id, sort_order ASC`,
      [id]
    );
    const sections = sectionsResult.rows;

    // 3. 섹션별 체크리스트, 아이템 합치기
    for (const section of sections) {
      const checklistsResult = await db.query(
        `SELECT id, title, text, sort_order 
           FROM checksheet_checklist 
          WHERE section_id = $1 
          ORDER BY id, sort_order ASC`,
        [section.id]
      );
      const checklists = checklistsResult.rows;

      for (const checklist of checklists) {
        const itemsResult = await db.query(
          `SELECT id, title, type, value, options, sort_order 
             FROM checksheet_item 
            WHERE checklist_id = $1 
            ORDER BY id, sort_order ASC`,
          [checklist.id]
        );
        checklist.items = itemsResult.rows;
      }
      section.checklists = checklists;
    }

    res.json({
      ...sheet,
      sections
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// 새 체크시트 추가
router.post('/', async (req, res) => {
  const { category, checksheetName, status } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO checksheet_list(category, checksheet_name, status) VALUES($1, $2, $3) RETURNING *',
      [category, checksheetName, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// 체크시트 수정
router.put('/:checksheetId', async (req, res) => {
  const { id, category, checksheetName, status } = req.body;
  try {
    const result = await db.query(
      `UPDATE 
        checksheet_list 
      SET
        category = $1, 
        checksheet_name = $2, 
        status = $3,
        updated_at = NOW()
      WHERE
        id = $4
      `,
      [category, checksheetName, status, req.params.checksheetId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});


// 섹션 추가
router.post('/:checksheetId/sections', async (req, res) => {
  const { title, text, sort_order } = req.body;
  const result = await db.query(
    `INSERT INTO checksheet_section (checksheet_id, title, text, sort_order)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.params.checksheetId, title, text, sort_order]
  );
  res.json(result.rows[0]);
});

// 섹션 수정
router.put('/section/:sectionId', async (req, res) => {
  const { title, text, sort_order } = req.body;
  await db.query(
    `UPDATE checksheet_section
     SET title=$1, text=$2, sort_order=$3, updated_at=NOW()
     WHERE id=$4`,
    [title, text, sort_order, req.params.sectionId]
  );
  res.json({ success: true });
});

// 섹션 삭제
router.delete('/section/:sectionId', async (req, res) => {
  await db.query(`DELETE FROM checksheet_section WHERE id=$1`, [req.params.sectionId]);
  res.json({ success: true });
});


// 체크리스트 추가
router.post('/section/:sectionId/checklists', async (req, res) => {
  const { title, text, sort_order } = req.body;
  const result = await db.query(
    `INSERT INTO checksheet_checklist (section_id, title, text, sort_order)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.params.sectionId, title, text, sort_order]
  );
  res.json(result.rows[0]);
});

// 체크리스트 수정
router.put('/checklist/:checklistId', async (req, res) => {
  const { title, text, sort_order } = req.body;
  await db.query(
    `UPDATE checksheet_checklist
     SET title=$1, text=$2, sort_order=$3, updated_at=NOW()
     WHERE id=$4`,
    [title, text, sort_order, req.params.checklistId]
  );
  res.json({ success: true });
});

// 체크리스트 삭제
router.delete('/checklist/:checklistId', async (req, res) => {
  await db.query(`DELETE FROM checksheet_checklist WHERE id=$1`, [req.params.checklistId]);
  res.json({ success: true });
});

// 항목 추가
router.post('/checklist/:checklistId/items', async (req, res) => {
  const { title, type, value, options, sort_order } = req.body;
  const result = await db.query(
    `INSERT INTO checksheet_item (checklist_id, title, type, value, options, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [req.params.checklistId, title, type, value, options, sort_order]
  );
  res.json(result.rows[0]);
});

// 항목 수정
router.put('/item/:itemId', async (req, res) => {
  const { title, type, value, sort_order } = req.body;
    await db.query(
    `UPDATE checksheet_item
     SET title=$1, value=$2, updated_at=NOW()
     WHERE id=$3`,
    [title, value, req.params.itemId]
  );
  res.json({ success: true });
});

// 항목 삭제
router.delete('/item/:itemId', async (req, res) => {
  await db.query(`DELETE FROM checksheet_item WHERE id=$1`, [req.params.itemId]);
  res.json({ success: true });
});

module.exports = router;
