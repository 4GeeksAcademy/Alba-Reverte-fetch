import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export const TodoList = () => {
    const [list, setList] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editedTodo, setEditedTodo] = useState(null);
    console.log("Aquí están mis tareas", list);

    const handleChange = (event) => {
        // event.target.value  tiene el valor del input
        // console.log(newTask);

        setNewTask(event.target.value)

    };

    const saveTask = async () => {
        try {
            const taskToSent = {
                "label": newTask,
                "is_done": false
            };
            console.log("contenido de task", taskToSent);

            const response = await fetch(`https://playground.4geeks.com/todo/todos/AlbaReverte`, {
                method: "POST",
                headers: {

                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskToSent),
            });
            console.log("respuesta:", response.status);

            if (!response.ok) {
                throw new Error("Error al crear la tarea");
            }

            const result = await response.json()
            console.log("tarea guardada:", result);
        } catch (error) {
            console.log(error);
        }
    };


    const editTodo = async (task, text) => {
        try {
    
          const updatedTask = { ...task, label: text };  
      
          const response = await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              
            },
            body: JSON.stringify(updatedTask),
          });
      
          if (!response.ok) {
            throw new Error("Error updating task");
          }
      
          const result = await response.json();
          const updatedTodos = list.map((todo) =>
            todo.id === task.id ? { ...todo, ...result } : todo 
          );
          setList(updatedTodos);
        } catch (error) {
          console.log(error);
        }
      };


    const getTask = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/AlbaReverte")
            if (!response.ok) {
                throw new Error("Error al crear la tarea");
            }
            const result = await response.json()
            console.log("guardado con éxito:", result); Text
            setList(result.todos)
        }

        catch (error) {
            console.log(error);
        }
    }

    const addTask = () => {
        if (!newTask.trim()) return;
        const objTask = {
            id: uuidv4(),
            task: newTask
        };
        setList(prevState => [...prevState, objTask])
        setNewTask("")
        saveTask()
    }




    const pressEnter = (event) => {
        if (event.key === "Enter") {
            addTask();
            saveTask();
        }
    }


    // const handleDelete = (id) => {
    //     const newList = list.filter(todo => todo.id !== id);
    //     setList(newList);
    // };
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Error al eliminar la tarea");
            }
            const newlist = list.filter(todo => todo.id !== id);
            setList(newlist);
            console.log("Tarea eliminada correctamente");
        } catch (error) {
            console.log("Error al eliminar la tarea:", error);
        }
    };



    const pendingTasks = list.filter((todo) => !todo.completed).length;


    useEffect(() => {
        getTask();
    }, [])

    // useEffect(() => {
    //     const storedTodos = localStorage.getItem('todos');
    //     if (storedTodos) {
    //         setTodos(JSON.parse(storedTodos));
    //     }
    // }, []);

    const handleEdit = (todo) => {
        setEditedTodo(todo);
    };

  

    const handleSave = async (editedText) => {
        
        await editTodo (todo, todo.text);
        setEditedTodo(null);
       
    };


    return (
        <div className="container">
            <h1 className="box d-flex justify-content-center mt-3">Mi Lista de Tareas</h1>
            <div className="box1 m-3">
                <input
                    value={newTask}
                    type="text"
                    onChange={handleChange}
                    onKeyDown={pressEnter}
                />
            </div>
            <div className="pizarra">
                <ul>
                    {list.map((task, index) => {
                        <li key={index}>{task.label}</li>
                    })}
                    {list.map((task) => (
                        <div className="row task-list" key={task.id}>
                            <li className="col-4">
                            {task.id === editedTodo?.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedTodo.text}
                                            onChange={(e) =>
                                                setEditedTodo({ ...editedTodo, text: e.target.value })
                                            }
                                        />
                                        <button className="save-button col-1" onClick={() => handleSave(editedTodo.text)}>
                                            <i class="fa-regular fa-floppy-disk"></i>
                                        </button>
                                    </>
                                ) : (
                                    <span className="task">{task.label}</span>
                                )}
                                <button className="modify-button col-1" onClick={() => handleEdit(task)}>
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button className="delete-button col-1" onClick={() => handleDelete(task.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                       
                            </li>
                        </div>
                    ))}

                </ul>
            </div>

            <div>
                <footer className="foot">
                    Tareas pendientes: {pendingTasks}
                </footer>
            </div>
        </div>

    );
}
