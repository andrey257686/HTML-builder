const fs = require('fs');
const path = require('path');
const readline = require('readline');

const readLines = readline.createInterface(process.stdin, process.stdout);

const filename = 'notes.txt';

const writeStream = fs.createWriteStream(
  path.join(__dirname, filename),
  'utf-8',
);

readLines.setPrompt(`Пожалуйста, введите ваше текст:\n`);
readLines.prompt();
readLines.on('line', (text) => {
  if (text.trim() === 'exit') {
    readLines.close();
    process.exit(0);
  }
  writeStream.write(`${text}\n`);
});
readLines.on('close', () => {
  process.stdout.write('До свидания!');
});
