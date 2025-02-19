import { useState, useContext } from "react";

// Components
import AddTaskButton from "./ui/AddTaskButton";
import TaskCard from "./TaskCard";
import DotsMenu from "./ui/DotsMenu";

export default function TodoCard({ todo, onAdd, onDelete }) {
    return (
        <section className="w-72">
            <div className="flex flex-col justify-start p-3 rounded-lg bg-gray-800 text-gray-400 max-h-140 overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                    <h2>{todo.title}</h2>
                    <DotsMenu toDoId={todo.id} onDelete={onDelete} className='text-gray-200 hover:bg-gray-600 hover:opacity-80' />
                </div>
                <section className="flex flex-col justify-start gap-3 overflow-y-auto max-h-110">
                    {todo.tasks && todo.tasks.map(task => (
                        <TaskCard key={task.id} task={task} taskId={task.id} toDoId={todo.id} onDelete={onDelete} />
                    ))}
                </section>
                <div className="mt-3">
                    <AddTaskButton columnId={todo.id} onAdd={onAdd} />
                </div>
            </div>
        </section>
    );
}