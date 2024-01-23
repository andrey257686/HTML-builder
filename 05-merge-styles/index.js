const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');

const bundleName = 'bundle.css';

fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw 'Ошибка чтения файлов';
  }
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
      const readStream = fs.createReadStream(
        path.join(stylesDir, file.name),
        'utf-8',
      );
      fs.rm(path.join(projectDir, bundleName), { recursive: true }, (err) => {
        readStream.on('data', (chunk) =>
          fs.appendFile(path.join(projectDir, bundleName), chunk, (err) => {
            if (err) {
              throw 'Ошибка записи bundle.css';
            }
          }),
        );
      });
    }
  });
});
