const express = require('express');
const router = express.Router();
const db = require('../db.js');

// 데이터 취득
router.get('/:taskId/section/:sectionId', async (req, res) => {
  const { taskId, sectionId } = req.params;

  try {
    // 1️⃣ task_section 조회 (task_id + section_id 기준)
    const sectionQuery = `
      SELECT 
        id AS "taskSectionId",
        section_id AS "sectionId",
        TO_CHAR(checked_at, 'YYYY/MM/DD HH24:MI:SS') AS "checkedAt"
      FROM task_section
      WHERE task_id = $1 AND section_id = $2
    `;
    const sectionRes = await db.query(sectionQuery, [taskId, sectionId]);

    const section = sectionRes.rows[0] || null;

    // 2️⃣ task_checklist 조회 (task_id 기준)
    const checklistQuery = `
      SELECT
        id AS "taskChecklistId",
        section_id AS "sectionId",
        checklist_id AS "checklistId",
        TO_CHAR(checked_at, 'YYYY/MM/DD HH24:MI:SS') AS "checkedAt"
      FROM task_checklist
      WHERE task_id = $1 AND section_id = $2
      ORDER BY id
    `;
    const checklistRes = await db.query(checklistQuery, [taskId, sectionId]);

    const checklist = checklistRes.rows || [];

    // 3️⃣ task_item_value 조회 (task_id 기준)
    const itemQuery = `
        SELECT
          id AS "taskItemId",
          section_id AS "sectionId",
          checklist_id AS "checklistId",
          item_id AS "itemId",
          value,
          TO_CHAR(updated_at, 'YYYY/MM/DD HH24:MI:SS') AS "updatedAt"
        FROM task_item_value
        WHERE task_id = $1 AND section_id = $2
        ORDER BY id
      `;

    const itemRes = await db.query(itemQuery, [taskId, sectionId]);
    const items = itemRes.rows;

    res.json({
      section,
      checklists: checklist,
      items
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Section 체크/해제
router.post('/section', async (req, res) => {
  const { taskId, sectionId, checkedAt } = req.body;

  try {
    const existing = await db.query(
      'SELECT id FROM task_section WHERE task_id = $1 AND section_id = $2',
      [taskId, sectionId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        'UPDATE task_section SET checked_at = $1 WHERE task_id = $2 AND section_id = $3',
        [checkedAt, taskId, sectionId]
      );
    } else {
      await db.query(
        'INSERT INTO task_section(task_id, section_id, checked_at) VALUES ($1, $2, $3)',
        [taskId, sectionId, checkedAt]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }

});

// -------------------------------
// Checklist 체크/해제 (task_id 기준)
// -------------------------------
router.post('/checklist', async (req, res) => {
  const { taskId, sectionId, checklistId, checkedAt } = req.body;

  try {
    const existing = await db.query(
      'SELECT id FROM task_checklist WHERE task_id = $1 AND checklist_id = $2',
      [taskId, checklistId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        'UPDATE task_checklist SET checked_at = $1 WHERE task_id = $2 AND checklist_id = $3',
        [checkedAt, taskId, checklistId]
      );
    } else {
      await db.query(
        'INSERT INTO task_checklist(task_id, section_id, checklist_id, checked_at) VALUES ($1, $2, $3, $4)',
        [taskId, sectionId, checklistId, checkedAt]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------
// Item 값 저장 (task_id 기준)
// -------------------------------
router.post('/item', async (req, res) => {
  const { taskId, sectionId, checklistId, itemId, value } = req.body;

  try {
    const existing = await db.query(
      'SELECT id FROM task_item_value WHERE task_id = $1 AND item_id = $2',
      [taskId, itemId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        'UPDATE task_item_value SET value = $1, updated_at = NOW() WHERE task_id = $2 AND item_id = $3',
        [value, taskId, itemId]
      );
    } else {
      await db.query(
        'INSERT INTO task_item_value(task_id, section_id, checklist_id, item_id, value) VALUES ($1, $2, $3, $4, $5)',
        [taskId, sectionId, checklistId, itemId, value]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
