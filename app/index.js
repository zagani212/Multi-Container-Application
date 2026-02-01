const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./database/db.js");

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
    .connect("mongodb://mongo:27017/todos")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Here is an error : ", err));

/**
 * GET /todos — get all todos
 */
app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

/**
 * POST /todos — create a new todo
 */
app.post("/todos", async (req, res) => {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
});

/**
 * GET /todos/:id — get a single todo by id
 */
app.get("/todos/:id", async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
});

/**
 * PUT /todos/:id — update a single todo by id
 */
app.put("/todos/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
});

/**
 * DELETE /todos/:id — delete a single todo by id
 */
app.delete("/todos/:id", async (req, res) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted" });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
