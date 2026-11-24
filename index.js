import express from 'express'
import cors from 'cors'
import pg from 'pg'

const app = express()
app.use(cors())
app.use(express.json())

// Railway יוצר את DATABASE_URL בשירות ה-Postgres.
// בשירות השרת מפנים אליו: ${{Postgres.DATABASE_URL}}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

await pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE
  )
`)

app.get('/', (req, res) => {
  res.json({ message: 'Postgres API is running on Railway' })
})

app.get('/api/tasks', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id')
  res.json(rows)
})

app.post('/api/tasks', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title is required' })

  const { rows } = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *', [title]
  )
  res.status(201).json(rows[0])
})

app.put('/api/tasks/:id', async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *', [Boolean(req.body.done), req.params.id]
  )
  res.json(rows[0])
})

app.delete('/api/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
  res.json({ message: 'Task deleted' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
