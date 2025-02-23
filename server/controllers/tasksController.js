const connection = require('../data/db.js')

// Store
function store(req, res) {
    const { todo_id } = req.params
    const { description, priority } = req.body

    console.log("Received data:", { todo_id, description, priority })


    // Validazione
    let error = []

    if (isNaN(parseInt(todo_id))) {
        error.push('Invalid todo_id')
    }

    if (!description || typeof description !== 'string' || description.length > 255) {
        error.push('Description must be a string of max 255 characters')
    }

    // se è diverso da undefined (definito), e diverso da null, allora ...
    if (priority !== undefined && priority !== null && (typeof priority !== 'number' || priority < 1 || priority > 3)) {
        error.push('Priority must be a number between 1 and 3')
    }

    if (error.length > 0) {
        return res.status(400).json({ error: error })
    }


    const sql = `INSERT INTO tasks (todo_id, description, priority) VALUES (?, ?, ?)`
    connection.query(sql, [todo_id, description, priority], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({ message: 'Task added succesfully' })
    })
}

// Modify (modifiche parziali)
function modify(req, res) {
    const { todo_id, id } = req.params
    const updates = req.body

    // Validazione
    let error = []

    if (isNaN(parseInt(todo_id)) || isNaN(parseInt(id))) {
        error.push('Invalid todo_id or id')
    }

    if (updates.description && (typeof updates.description !== 'string' || updates.description.length > 255)) {
        error.push('Description must be a string of max 255 characters')
    }

    if (updates.priority !== undefined && (typeof updates.priority !== 'number' || updates.priority < 1 || updates.priority > 3)) {
        error.push('Priority must be a number between 1 and 3')
    }

    if (updates.completed !== undefined) {
        if (typeof updates.completed === 'string') {
            updates.completed = updates.completed === 'true' || updates.completed === '1';
        } else if (typeof updates.completed === 'number') {
            updates.completed = updates.completed === 1;
        } else if (typeof updates.completed !== 'boolean') {
            error.push('Completed must be a boolean')
        }
    }

    if (error.length > 0) {
        return res.status(400).json({ error: error })
    }

    const sql = `UPDATE tasks SET ? WHERE id = ? AND todo_id = ?`
    connection.query(sql, [updates, id, todo_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Resource not found' })
        res.status(200).json({ message: 'Task updated successfully' })
    })
}

// Destroy
function destroy(req, res) {
    const { todo_id, id } = req.params

    if (isNaN(parseInt(id)) || isNaN(parseInt(todo_id))) {
        return res.status(400).json({ error: 'Invalid id' })
    }

    const sql = `DELETE FROM tasks WHERE id = ? AND todo_id = ?`

    connection.query(sql, [id, todo_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Resource not found' })
        res.sendStatus(204)
    })
}

module.exports = { store, modify, destroy }