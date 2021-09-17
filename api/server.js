const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

mongoose
  .connect(
    'mongodb://admin:123456@127.0.0.1:27017/mern-todo?authSource=admin&w=1',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to DB')
  })
  .catch((err) => {
    console.error(err)
  })

const Todo = require('./models/Todo')

// 获取todo列表
app.get('/todos', async (req, res) => {
  const todos = await Todo.find()

  res.json(todos)
})

// 新增todo事项
app.post('/todo/new', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })
  todo.save()

  res.json(todo)
})

// 删除todo事项
app.delete('/todo/delete/:id', async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id)

  res.json(result)
})

// 修改todo完成状态
app.put('/todo/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  todo.complete = !todo.complete
  todo.save()

  res.json(todo)
})

app.listen(3001, () => {
  console.log('server started on port 3001')
})
