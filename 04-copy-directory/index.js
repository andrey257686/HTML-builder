const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

fs.mkdir(copyDir, { recursive: true }, (err) => {
  if (err) {
    throw 'Ошибка создания директории';
  }
  fs.readdir(filesDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw 'Ошибка чтения файлов';
    }
    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFile(
          path.join(filesDir, file.name),
          path.join(copyDir, file.name),
          (err) => {
            if (err) {
              throw 'Ошибка копирования файлов';
            }
          },
        );
      }
    });
  });
});
