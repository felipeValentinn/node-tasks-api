import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    // ── TASKS ────────────────────────────────────────────────────────────────

    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select(
                'tasks',
                search ? { title: search, description: search } : null
            )

            return res.end(JSON.stringify(tasks))
        },
    },

    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description) {
                return res
                    .writeHead(400)
                    .end(JSON.stringify({ error: 'title and description are required.' }))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end(JSON.stringify(task))
        },
    },

    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title && !description) {
                return res
                    .writeHead(400)
                    .end(JSON.stringify({ error: 'At least title or description must be provided.' }))
            }

            const task = database.findById('tasks', id)

            if (!task) {
                return res
                    .writeHead(404)
                    .end(JSON.stringify({ error: 'Task not found.' }))
            }

            const updated = database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                updated_at: new Date().toISOString(),
            })

            return updated
                ? res.writeHead(204).end()
                : res.writeHead(500).end()
        },
    },

    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.findById('tasks', id)

            if (!task) {
                return res
                    .writeHead(404)
                    .end(JSON.stringify({ error: 'Task not found.' }))
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        },
    },

    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.findById('tasks', id)

            if (!task) {
                return res
                    .writeHead(404)
                    .end(JSON.stringify({ error: 'Task not found.' }))
            }

            // Toggle: se já está completa, volta para null; senão, marca agora
            const completed_at = task.completed_at ? null : new Date().toISOString()

            database.update('tasks', id, {
                completed_at,
                updated_at: new Date().toISOString(),
            })

            return res.writeHead(204).end()
        },
    },



    {
        method: 'GET',
        path: buildRoutePath('/users'),
        handler: (req, res) => {
            const { search } = req.query

            const users = database.select(
                'users',
                search ? { name: search, email: search } : null
            )

            return res.end(JSON.stringify(users))
        },
    },

    {
        method: 'POST',
        path: buildRoutePath('/users'),
        handler: (req, res) => {
            const { name, email } = req.body

            const user = {
                id: randomUUID(),
                name,
                email,
            }

            database.insert('users', user)

            return res.writeHead(201).end()
        },
    },

    {
        method: 'PUT',
        path: buildRoutePath('/users/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { name, email } = req.body

            database.update('users', id, { name, email })

            return res.writeHead(204).end()
        },
    },

    {
        method: 'DELETE',
        path: buildRoutePath('/users/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('users', id)

            return res.writeHead(204).end()
        },
    },
]
