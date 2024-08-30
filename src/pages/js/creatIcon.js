///ask user to input svg and name to add to icon.json file in terminal

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const iconJson = path.join(__dirname, '/icon.json');

rl.question('Enter the name of the icon: ', (name) => {
    rl.question('Enter the svg contents: ', (svg) => {
        const icon = {
            [name]: svg
        };
        fs.readFile(iconJson, 'utf8', (err, data) => {
            if (err) {
                fs.writeFileSync(iconJson, JSON.stringify(icon, null, 2));
            } else {
                const icons = JSON.parse(data);
                const newIcons = {
                    ...icons,
                    ...icon
                };
                fs.writeFileSync(iconJson, JSON.stringify(newIcons, null, 2));
            }
            rl.close();
        });
    });
});