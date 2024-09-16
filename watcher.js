import {exec, spawn} from 'node:child_process'
import { watch } from 'node:fs/promises';

const [node, _, file] = process.argv

function spawnNode() {
    const proc = spawn(node, [file]);
    
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)

    proc.on('close', (code) => {
        if (code !== null) {
            process.exit(code)
        }
    })

    return proc
}

let childNodeProcess = spawnNode();
const watcher = watch('./', {recursive: true})

for await (const event of watcher) {
    if (event.filename.endsWith('.js')) {
        childNodeProcess.kill('SIGKILL');
        childNodeProcess = spawnNode();
    }
}