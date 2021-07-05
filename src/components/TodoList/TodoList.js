import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSave, faWindowClose, faChevronUp, faUndo } from "@fortawesome/free-solid-svg-icons";
import { Button, message } from "antd";
import { ReactSVG } from 'react-svg'
import moment from "moment";

import "./TodoList.scss";
import ButtonComponent from "./Button";

function TodoList() {
  const url = "https://60d05b407de0b2001710869b.mockapi.io/todos";

  const [todoList, setTodoList] = useState([]);
  const [toDidList, setToDidList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [needLoading, setNeedLoading] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);

  const [undoTitle, setUndoTitle] = useState('')
  const [undoItem, setUndoItem] = useState()
  const [undoTimer, setUndoTimer] = useState(0)

  const [newName, setNewName] = useState('')
  const [editName, setEditName] = useState('')

  const refInput = useRef(null)

  const onHandleChange = (e, input) => {
    if (input === "newName") setNewName(e.target.value);
    if (input === "editName") setEditName(e.target.value);
  };

  // Fetch data
  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          const results = result.map((item) => {
            return { ...item, editing: false };
          });
          const resultsTrue = results.filter(item => item.status === "todo").sort((a, b) => {
            return moment(b.createdAt).unix() - moment(a.createdAt).unix()
          })
          setTodoList(resultsTrue);
          setToDidList(results.filter(item => item.status === "did"));
          setNeedLoading(false);
          setIsLoading(false);
        },
        (error) => {
          setIsLoading(false);
          console.log(
            "hiendev ~ file: index.jsx ~ line 19 ~ useEffect ~ error",
            error
          );
        }
      );
  }, [needLoading]);

  // Add new item
  const handleAddNewItem = () => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        createdAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSz')
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setNeedLoading(true);
          setNewName("");
          message.success("Create successfully");
        },
        (error) => {
          message.error("Create failed");
          console.log(
            "hiendev ~ file: index.jsx ~ line 30 ~ handleOk ~ error",
            error
          );
        }
      );
  };

  // Edit item
  function onEditItem(item) {
    setEditName(item.name)
    setUndoItem(item)

    const newTodoList = todoList.map((todo) => {
      if (todo.id === item.id) return { ...todo, editing: true };
      return { ...todo, editing: false };
    });
    setTodoList(newTodoList);
  }

  // Save item when edit
  function onSaveItem(item) {
    setIsLoading(true);
    fetch(url + "/" + item.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editName
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setNeedLoading(true)
          setEditName("")
          setUndoTitle('Modified: ' + item.name)
          setUndoTimer(10)
          message.success("Edit successfully");
        },
        (error) => {
          message.error("Edit failed");
          console.log(
            "hiendev ~ file: index.jsx ~ line 46 ~ onEditItem ~ error",
            error
          );
        }
      );
  }

  // Edit status
  function onChecked(item) {
    fetch(url + "/" + item.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...item,
        status: item.status === "todo" ? "did" : "todo"
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setNeedLoading(true);
        },
        (error) => {
          console.log(
            "hiendev ~ file: TodoList.js ~ line 163 ~ onChecked ~ error",
            error
          );
        }
      );
  }

  // Delete item
  function onDeleteItem(item) {
    fetch(url + "/" + item.id, { method: "DELETE" })
      .then((res) => res.json())
      .then(
        (result) => {
          setUndoTitle('Deleted: ' + item.name)
          setUndoItem({ ...item, isDelete: true })
          setNeedLoading(true)
          setUndoTimer(10)
          message.success("Delete successfully");
        },
        (error) => {
          message.error("Delete failed");
          console.log(
            "hiendev ~ file: index.jsx ~ line 31 ~ onDeleteItem ~ error",
            error
          );
        }
      );
  }

  useEffect(() => {
    if (undoTimer > 0)
      setTimeout(() => {
        setUndoTimer(undoTimer - 1)
      }, 1000);
    else {
      setUndoTitle('')
      setUndoItem()
    }
  }, [undoTimer])

  // Focus edit input
  useEffect(() => {
    if (editName && refInput?.current) refInput.current.focus();
  }, [editName])

  const onHandleUndo = () => {
    fetch(undoItem.isDelete ? url : (url + "/" + undoItem.id), {
      method: undoItem.isDelete ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: undoItem.name,
        createdAt: moment(undoItem.createdAt).format('YYYY-MM-DDTHH:mm:ss.SSSz')
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setNeedLoading(true);
          setUndoTitle('')
          setUndoItem()
          message.success("Undo successfully");
        },
        (error) => {
          message.error("Undo failed");
          console.log(
            "hiendev ~ file: index.jsx ~ line 30 ~ handleOk ~ error",
            error
          );
        }
      );
  }

  return (
    <div className="todo-app">
      {undoTitle &&
        <div className="undo">
          <span className="undo-timer">{undoTimer > 0 ? undoTimer : ''}</span>
          <span>{undoTitle}</span>
          <Button
            className="btn-undo"
            type="primary"
            onClick={onHandleUndo}
            loading={isLoading}
          >
            <FontAwesomeIcon icon={faUndo} />
          </Button>
        </div>
      }
      <div className="todo-container input-add" style={{ position: "relative" }}>
        <input
          className="input-style"
          placeholder="Add new task..."
          value={newName}
          onChange={(event) => {
            onHandleChange(event, "newName");
          }}
          onKeyUp={(event) => {
            if (event.keyCode === 13) handleAddNewItem()
          }} />
        <Button
          style={{ position: "absolute", right: "4px" }}
          type="primary"
          disabled={!newName}
          onClick={handleAddNewItem}
          loading={isLoading}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>

      {/* Show image when there's no task */}
      {todoList.length === 0 && toDidList.length === 0 &&
        <div className="todo-svg-container">
          <div className="todo-svg">
            <ReactSVG src="todolist.svg" />
          </div>
        </div>
      }

      <div className="todo-list-container">
        {todoList?.map((item) => {
          return (
            <div className="todo-container">
              <div className="todo-content" onClick={() => onChecked(item)}>
                {item.editing === false ? (
                  <>
                    <div class="round">
                      <input
                        id="checkbox"
                        type="checkbox"
                        checked={item.status === "did" ? true : false}
                        onClick={() => onChecked(item)} />
                      <label for="checkbox"></label>
                    </div>
                    <div
                      key={item.id}
                      style={{
                        textDecoration:
                          item.status === "todo" ? "none" : "line-through",
                      }}
                    >
                      {item.name}
                    </div>
                  </>
                ) : (
                  <input
                    className="edit-input"
                    type="text"
                    ref={refInput}
                    value={editName}
                    onChange={(event) => {
                      onHandleChange(event, "editName");
                    }}
                  />
                )}
              </div>
              <div className="todo-action">
                <ButtonComponent
                  type="default"
                  className="button-edit-del"
                  style={{ marginRight: 4 }}
                  onClick={() => {
                    if (!item.editing) onEditItem(item);
                    else onSaveItem(item);
                  }}
                >
                  {item.editing === false ? <FontAwesomeIcon icon={faEdit} /> : <FontAwesomeIcon icon={faSave} />}
                </ButtonComponent>
                {item.editing === false && (
                  <ButtonComponent className="button-edit-del" onClick={() => onDeleteItem(item)}><FontAwesomeIcon icon={faTrash} /></ButtonComponent>
                )}
                {item.editing === true && (
                  <ButtonComponent type="default" onClick={() => setNeedLoading(true)}>
                    <FontAwesomeIcon icon={faWindowClose} />
                  </ButtonComponent>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toDidList.length > 0 &&
        <div className="tasks-done" onClick={() => {
          setIsCollapse(!isCollapse)
        }}>
          <FontAwesomeIcon
            className={`${isCollapse ? 'icon-up' : 'icon-down'}`}
            icon={faChevronUp}
          />
          <span className="tasks-done-title">Tasks completed</span>
        </div>
      }

      <div className="todo-list-container">
        {(isCollapse ? [] : toDidList).map((item) => {
          return (
            <div className="todo-container" onClick={() => onChecked(item)}>
              <div className="todo-content">
                <div class="round">
                  <input
                    id="checkbox"
                    type="checkbox"
                    checked={item.status === "did" ? true : false}
                    onClick={() => onChecked(item)} />
                  <label for="checkbox"></label>
                </div>
                <div
                  key={item.id}
                  style={{
                    textDecoration:
                      item.status === "todo" ? "none" : "line-through",
                  }}
                >
                  {item.name}
                </div>
              </div>
              <div className="todo-action">
                {item.editing === false && (
                  <ButtonComponent className="button-edit-del" type="danger" onClick={() => onDeleteItem(item)}><FontAwesomeIcon icon={faTrash} /></ButtonComponent>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodoList;
