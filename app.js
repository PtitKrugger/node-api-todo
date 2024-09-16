import { createServer } from "node:http";
import { create, index, remove, update } from "./functions/api/todos.js";
import { NotFoundError, BadRequestError } from "./functions/errors.js";

const server = createServer(async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const url = new URL(req.url, `http://${req.headers.host}`);
        const endpoint = `${req.method}:${url.pathname}`;
        const method = req.method;
        const contentType = req.headers['content-type'];
        let results;

        if (contentType !== 'application/json' && (method === 'POST' || method === 'PUT')) {
            throw new BadRequestError();
        }

        switch(endpoint) {
            case 'GET:/todos':
                results = await index(req, res, url);
                break;
            case 'POST:/todos':
                results = await create(req, res);
                break;
            case 'PUT:/todos':
                results = await update(req, res, url);
                break;
            case 'DELETE:/todos':
                results = await remove(req, res, url);
                break;
            default:
                res.writeHead(404);
        }
        if (results) {
            res.write(JSON.stringify(results));
        }        
    }
    catch (error) {
        if (error instanceof NotFoundError) {
            res.writeHead(404, 'Not found');
        }
        else if (error instanceof BadRequestError) {
            res.writeHead(400, 'Bad Request');
        }
        else {
            throw error;
        }
    }

    res.end();
}).listen('3000');