import { useEffect, useState } from 'react'
const api_base = 'http://localhost:3001'

function App() {
  const [todos, setTodos] = useState([]) // todo列表
  const [popupActive, setPopupActive] = useState(false) // 弹窗显示与隐藏
  const [newTodo, setNewTodo] = useState('') // 新todo

  // 首次获取todo列表，只执行一次
  useEffect(() => {
    GetTodos()
  }, [])

  // 获取todo
  const GetTodos = () => {
    fetch(api_base + '/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Error: ', err))
  }

  // 设置完成状态
  const completeTodo = async (id) => {
    const data = await fetch(api_base + '/todo/complete/' + id, {
      method: 'PUT',
    }).then((res) => res.json())

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete
        }

        return todo
      })
    )
  }

  // 添加新任务
  const addTodo = async () => {
    const data = await fetch(api_base + '/todo/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json())

    setTodos([...todos, data])

    setPopupActive(false)
    setNewTodo('')
  }

  // 删除任务
  const deleteTodo = async (id) => {
    const data = await fetch(api_base + '/todo/delete/' + id, {
      method: 'DELETE',
    }).then((res) => res.json())

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id))
  }

  return (
    <div className="App">
      <h1>Welcome</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={'todo' + (todo.complete ? ' is-complete' : '')}
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>

              <div className="text">{todo.text}</div>

              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                x
              </div>
            </div>
          ))
        ) : (
          <p>You currently have no tasks</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default App
