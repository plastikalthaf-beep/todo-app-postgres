'use client';

import { Trash } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!newTitle) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    setNewTitle('');
    fetchTodos();
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-5">ToDo List + postgres</h1>
      <div className="flex mb-5">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Add new task..."
        />
        <button onClick={addTodo} className="p-2 bg-blue-500 text-white rounded-r">
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center mb-2">
            <span className={todo.completed ? 'line-through' : ''}>{todo.title}</span>
            <div className='flex gap-3'>
              <button onClick={() => toggleComplete(todo.id, todo.completed)} className="mr-2 text-green-500">
                {todo.completed ? 'Undo ✗' : 'Done ✓'}
              </button>
              <button onClick={() => deleteTodo(todo.id)} className="flex gap-1 items-center bg-red-500 px-1 rounded text-white">
                <span>Delete</span> <Trash size={16}/>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}