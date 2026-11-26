import { useEffect, useState } from 'react'

// כתובת ה-API. Vite מכניס אותה לקוד בזמן ה-build.
// מקומית: קובץ .env, ב-Railway: Variables של שירות הקליינט.
const API = import.meta.env.VITE_API_URL

// תרגיל 1: כותרת מהמשתנים. אם המשתנה לא מוגדר - כותרת ברירת מחדל.
const TITLE = import.meta.env.VITE_TITLE || 'המשימות שלי'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  async function load() {
    const res = await fetch(`${API}/api/tasks`)
    setTasks(await res.json())
  }

  useEffect(() => { load() }, [])

  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    await fetch(`${API}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    setTitle('')
    load()
  }

  async function toggle(task) {
    await fetch(`${API}/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done })
    })
    load()
  }

  async function remove(task) {
    await fetch(`${API}/api/tasks/${task._id}`, { method: 'DELETE' })
    load()
  }

  // תרגיל 2: כמה משימות נשארו לבצע
  const remaining = tasks.filter(t => !t.done).length

  return (
    <main>
      <h1>{TITLE}</h1>
      <p className="api">API: {API}</p>
      <p className="counter">נשארו לבצע: {remaining} מתוך {tasks.length}</p>

      <form onSubmit={addTask}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="משימה חדשה" />
        <button>הוספה</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task._id} className={task.done ? 'done' : ''}>
            <input type="checkbox" checked={task.done} onChange={() => toggle(task)} />
            <span>{task.title}</span>
            <button onClick={() => remove(task)}>מחיקה</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
