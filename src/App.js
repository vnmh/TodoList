import React from "react";
import './App.scss';

import TodoList from './components/TodoList/TodoList';

function App() {
  return (
    <div className='todo-app-container'>
      <h1>COME SEE MY TODO LIST</h1>
      <TodoList />
    </div>
  );
}

export default App;
