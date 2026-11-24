import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
app.use(cors())
app.use(express.json())

// Railway יוצר את MONGO_URL בשירות ה-MongoDB.
// בשירות השרת מפנים אליו: ${{MongoDB.MONGO_URL}}
await mongoose.connect(process.env.MONGO_URL, { dbName: 'tasksdb' })

const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false }
}))

app.get('/', (req, res) => {
  res.json({ message: 'MongoDB API is running on Railway' })
})

app.get('/api/tasks', async (req, res) => {
  res.json(await Task.find())
})

app.post('/api/tasks', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title is required' })
  res.status(201).json(await Task.create({ title }))
})

app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id, { done: Boolean(req.body.done) }, { new: true }
  )
  res.json(task)
})

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
  res.json({ message: 'Task deleted' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
