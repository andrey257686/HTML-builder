const fs = require('fs');
const path = require('path');

let data = '';

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readStream.on('data', chunk => data+=chunk);
readStream.on('end', () => console.log(data));

// fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8').pipe(process.stdout);