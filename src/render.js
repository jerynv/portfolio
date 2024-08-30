const {
    join
} = require('path');
const {
    file
} = require('bun');

const serveStaticFile = async (path) => {
    if (path === '/favicon.ico') {
        return new Response(serveStaticFile('../../components/icon.ico'), {
            headers: {
                'Content-Type': 'image/x-icon'
            }
        })
    }
    try {
        const fp = join(__dirname, 'pages', path);
        const fc = await file(fp).text();
        const ext = path.split('.').pop();
        let contentType = 'text/plain';
        let addHeaders = {};
        switch (ext) {
            case 'html':
                contentType = 'text/html';
                break;
            case 'css':
                contentType = 'text/css';
                break;
            case 'js':
                contentType = 'application/javascript';
                break;
            case 'json':
                contentType = 'application/json';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            case 'ico':
                contentType = 'image/x-icon';
                break;
            case 'jpg':
            case 'jpeg':
                contentType = 'image/jpeg';
                break;
            case "woff":
                contentType = "font/woff";
                break;
            case "woff2":
                //fic incorrect file size for woff2
                addHeaders = {
                    'Content-Encoding': 'gzip'
                }
                contentType = "font/woff2";
                break;
                // Add more content types as needed
        }

        return new Response(fc, {
            headers: {
                'Content-Type': contentType,
                ...addHeaders
            },
        });
    } catch (error) {
        return Render("404");
    }
};

async function Render(path) {
    const f = Bun.file("src/pages/map/" + path + "/index.html");
    return new Response(await f.text(), {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}

function colorLog(msg) {
    msg = msg ? msg.toString() : ''
    if (msg.includes('.ico')) {
        msg = msg + "\n"
        console.log('\x1b[35m%s\x1b[0m', msg);
        return;
    }

    newMsg = msg.split('.').pop();

    switch (newMsg) {
        case 'css':
            console.log('\x1b[36m%s\x1b[0m', msg);
            break;
        case 'js':
            console.log('\x1b[33m%s\x1b[0m', msg);
            break;
        case 'html':
            //red
            console.log('\x1b[31m%s\x1b[0m', msg);
            break;
        default:
            console.log('\x1b[37m%s\x1b[0m', msg);

    }
}


module.exports = {
    Render,
    serveStaticFile,
    colorLog
};