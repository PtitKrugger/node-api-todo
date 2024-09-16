import { BadRequestError } from "../errors.js";
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from "../todos.js";
import { json } from 'node:stream/consumers';

export async function index(req, res, url) {
    const id = parseInt(url.searchParams.get('id'), 10);
    if (id) {
        return getTodo(id);
    }
    return getTodos();
}

export async function create(req, res) {
    try {
        const jsonContent = await json(req);
        return createTodo(jsonContent);
    } catch {
        throw new BadRequestError();
    }
}

export async function update(req, res, url) {
    const id = parseInt(url.searchParams.get('id'), 10);
    try {
        const jsonContent = await json(req);
        return updateTodo(id, jsonContent);        
    } catch {
        throw new BadRequestError();
    }
}

export async function remove(req, res, url) {
    const id = parseInt(url.searchParams.get('id'), 10);
    await deleteTodo(id);
    res.writeHead(204);
}