import {
    Render,
    serveStaticFile,
    colorLog
} from './render.js';

//regular https server bun not express

const server = Bun.serve({
    hostname: 'localhost',
    port: 3000,
    async fetch(req) {


        let path = new URL(req.url).pathname;
        colorLog(path);
        if (path === '/') {
            return await Render("landing")
        }
        return await serveStaticFile(path);
    }
});

console.log(`Listening on ${server.hostname}:${server.port}`);