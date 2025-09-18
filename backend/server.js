// server.js
const express = require('express');
const cors = require('cors');
const pkg = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL 풀 생성
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// 체크시트 리스트 불러오기
app.get('/api/checksheets', async (req, res) => {
  const client = await pool.connect(); // Pool에서 클라이언트 가져오기
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
    const result = await client.query(query);

    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  } finally {
    client.release(); // 클라이언트 반환
  }
});

// 새 체크시트 추가
app.post('/api/checksheets', async (req, res) => {
  const { category, checksheetName, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO checksheet_list(category, checksheet_name, status) VALUES($1, $2, $3) RETURNING *',
      [category, checksheetName, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.put('/api/checksheets/:checksheetId', async (req, res) => {
  const { id, category, checksheetName, status } = req.body;
  try {
    const result = await pool.query(
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

// app.put('/api/checksheets', async (req, res) => {
//   const { id, category, checksheetName, status } = req.body;
//   try {
//     const result = await pool.query(
//       `UPDATE 
//         checksheet_list 
//       SET
//         category = $1, 
//         checksheet_name = $2, 
//         status = $3,
//         updated_at = NOW()
//       WHERE
//         id = $4
//       `,
//       [category, checksheetName, status, id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'DB error' });
//   }
// });

// 코드 마스터 불러오기

app.get('/api/code', async (req, res) => {
  const client = await pool.connect(); // Pool에서 클라이언트 가져오기

  const category = req.query.category; // 쿼리에서 가져옴

  try {
    const query = `
      SELECT 
        id, category, code, name, color
      FROM
        code_master
      WHERE
        category = $1; `

    const result = await client.query(query, [category]);

    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  } finally {
    client.release(); // 클라이언트 반환
  }
});

// 섹션 추가
app.post('/api/checksheet/:checksheetId/sections', async (req, res) => {
  const { title, text, sort_order } = req.body;
  const result = await pool.query(
    `INSERT INTO checksheet_section (checksheet_id, title, text, sort_order)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.params.checksheetId, title, text, sort_order]
  );
  res.json(result.rows[0]);
});

// 섹션 수정
app.put('/api/section/:sectionId', async (req, res) => {
  const { title, text, sort_order } = req.body;
  await pool.query(
    `UPDATE checksheet_section
     SET title=$1, text=$2, sort_order=$3, updated_at=NOW()
     WHERE id=$4`,
    [title, text, sort_order, req.params.sectionId]
  );
  res.json({ success: true });
});

// 섹션 삭제
app.delete('/api/section/:sectionId', async (req, res) => {
  await pool.query(`DELETE FROM checksheet_section WHERE id=$1`, [req.params.sectionId]);
  res.json({ success: true });
});

// 체크리스트 추가
app.post('/api/section/:sectionId/checklists', async (req, res) => {
  const { title, text, sort_order } = req.body;
  const result = await pool.query(
    `INSERT INTO checksheet_checklist (section_id, title, text, sort_order)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.params.sectionId, title, text, sort_order]
  );
  res.json(result.rows[0]);
});

// 체크리스트 수정
app.put('/api/checklist/:checklistId', async (req, res) => {
  const { title, text, sort_order } = req.body;
  await pool.query(
    `UPDATE checksheet_checklist
     SET title=$1, text=$2, sort_order=$3, updated_at=NOW()
     WHERE id=$4`,
    [title, text, sort_order, req.params.checklistId]
  );
  res.json({ success: true });
});

// 체크리스트 삭제
app.delete('/api/checklist/:checklistId', async (req, res) => {
  await pool.query(`DELETE FROM checksheet_checklist WHERE id=$1`, [req.params.checklistId]);
  res.json({ success: true });
});

// 항목 추가
app.post('/api/checklist/:checklistId/items', async (req, res) => {
  const { title, type, value, options, sort_order } = req.body;
  const result = await pool.query(
    `INSERT INTO checksheet_item (checklist_id, title, type, value, options, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [req.params.checklistId, title, type, value, options, sort_order]
  );
  res.json(result.rows[0]);
});

// 항목 수정
app.put('/api/item/:itemId', async (req, res) => {
  const { title, type, value, sort_order } = req.body;
    await pool.query(
    `UPDATE checksheet_item
     SET title=$1, value=$2, updated_at=NOW()
     WHERE id=$3`,
    [title, value, req.params.itemId]
  );
  res.json({ success: true });
});

// 항목 삭제
app.delete('/api/item/:itemId', async (req, res) => {
  await pool.query(`DELETE FROM checksheet_item WHERE id=$1`, [req.params.itemId]);
  res.json({ success: true });
});

// 체크시트 정보 취득
app.get('/api/checksheet/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. 시트 정보
    const sheetResult = await pool.query(
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
    const sectionsResult = await pool.query(
      `SELECT id, title, text, sort_order 
         FROM checksheet_section 
        WHERE checksheet_id = $1 
        ORDER BY sort_order ASC, id`,
      [id]
    );
    const sections = sectionsResult.rows;

    // 3. 섹션별 체크리스트, 아이템 합치기
    for (const section of sections) {
      const checklistsResult = await pool.query(
        `SELECT id, title, text, sort_order 
           FROM checksheet_checklist 
          WHERE section_id = $1 
          ORDER BY sort_order ASC`,
        [section.id]
      );
      const checklists = checklistsResult.rows;

      for (const checklist of checklists) {
        const itemsResult = await pool.query(
          `SELECT id, title, type, value, options, sort_order 
             FROM checksheet_item 
            WHERE checklist_id = $1 
            ORDER BY sort_order ASC`,
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



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
