const express = require("express")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")

// Import the Task model
const Task = require("./models/Task")

// Initialize Express app
const app = express()

// Middleware
app.use(bodyParser.json()) // Parse JSON data for API
app.use(methodOverride("_method")) // Override with _method in query string or body
app.use(cors())

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/todo-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))

// Routes

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks) // Send tasks as JSON response
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a new task
app.post("/api/tasks", async (req, res) => {
  const { title, description, completed } = req.body
  try {
    const newTask = await Task.create({ title, description, completed })

    res.status(201).json(newTask) // Respond with the created task
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update task properties
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    )
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" })
    }
    res.json(updatedTask) // Respond with the updated task
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" })
    }
    res.json({ message: "Task deleted" }) // Respond with confirmation
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Server setup
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
