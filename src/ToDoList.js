import React, { useState, useEffect } from 'react';

const ToDoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === '') {
      alert('Task cannot be empty!');
      return;
    }
    setTasks([
      ...tasks,
      { id: Date.now(), text: task, completed: false, timestamp: Date.now() }
    ]);
    setTask('');
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id) => {
    if (editValue.trim() === '') {
      alert('Task cannot be empty!');
      return;
    }
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, text: editValue } : t
    );
    setTasks(updatedTasks);
    setEditingId(null);
    setEditValue('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'newest') return b.timestamp - a.timestamp;
    if (sort === 'oldest') return a.timestamp - b.timestamp;
    return 0;
  });

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 To Do List</h1>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What is the task today?"
          className="flex-grow p-3 rounded-lg border border-purple-300 focus:outline-none text-black"
        />
        <button
          onClick={addTask}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Add Task
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          {['all', 'completed', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full transition ${
                filter === f
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-purple-700 hover:bg-pink-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded-lg text-purple-700"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {sortedTasks.length === 0 ? (
        <p className="text-center text-white italic">No tasks available.</p>
      ) : (
        <ul className="space-y-3">
          {sortedTasks.map((t) => (
            <li
              key={t.id}
              className={`flex justify-between items-center p-3 rounded-lg shadow-lg bg-white text-purple-800 ${
                t.completed ? 'line-through opacity-70' : ''
              }`}
            >
              {editingId === t.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow p-1 rounded border text-black"
                  />
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{t.text}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleComplete(t.id)}
                      className={`px-2 py-1 rounded ${
                        t.completed
                          ? 'bg-yellow-400 hover:bg-yellow-500'
                          : 'bg-green-400 hover:bg-green-500'
                      } text-white`}
                    >
                      {t.completed ? 'Undo' : 'Done'}
                    </button>
                    <button
                      onClick={() => startEdit(t.id, t.text)}
                      className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeTask(t.id)}
                      className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToDoList;
