import { readFile, writeFile } from 'node:fs/promises'
import { NotFoundError } from './errors.js';

const path = 'storage/todos.json'

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */


/**
 * @return {Promise<Todo[]>}
 */
export async function getTodos() {
    const todos = await readFile(path, { encoding: 'utf-8' })
    return JSON.parse(todos);        
}


/**
 * @return {Promise<Todo>}
 */
export async function getTodo(id) {
    const todos = await getTodos();
    const todo = todos.find(todo => todo.id === id);

    if (todo === undefined) {
        throw new NotFoundError();
    }

    return todo;
}


/**
 * @param {string} title
 * @param {boolean} completed
 * @return {Promise<Todo>}
 */
export async function createTodo({title = "Texte par défaut", completed = false}) {
    let todos = await getTodos();
    const newTodo = {
        "id": Date.now(),
        "title": title,
        "completed": completed
    }

    todos.push(newTodo);
    await writeFile(path, JSON.stringify(todos, null, 2), 'utf-8');
    return newTodo;
}


/**
 * @param {number} id 
 * @param {{title?: string, completed?: boolean}} partialTodo
 * @return {Promise<Todo>}
 */
export async function updateTodo(id, partialTodo) {
    const todos = await getTodos();
    const todo = todos.find(todo => todo.id === id);
    
    if (todo === undefined) {
        throw new NotFoundError();
    }

    Object.assign(todo, partialTodo);
    await writeFile(path, JSON.stringify(todos, null, 2), 'utf-8');

    return todo;
}


/**
 * @param {*} id 
 */
export async function deleteTodo(id) {
    const todos = await getTodos();
    const todo = todos.findIndex(todo => todo.id === id);
    
    if (todo === -1) {
        throw new NotFoundError;
    }

    await writeFile(path, JSON.stringify(todos.filter(todo => todo.id !== id), null, 2));
}