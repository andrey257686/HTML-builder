const fs = require('fs');
const path = require('path');

const copyDir = path.join(__dirname, 'project-dist');
const assetsDir = path.join(__dirname, 'assets');

// ================ Копирование assets ====================

const copyDirFunc = function (src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      throw 'Ошибка создания директории';
    }
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        throw 'Ошибка чтения директории';
      }
      files.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(
            path.join(src, file.name),
            path.join(dest, file.name),
            (err) => {
              if (err) {
                throw 'Ошибка копирования файлов в директории';
              }
            },
          );
        } else if (file.isDirectory()) {
          copyDirFunc(path.join(src, file.name), path.join(dest, file.name));
        }
      });
    });
  });
};

fs.mkdir(copyDir, { recursive: true }, (err) => {
  if (err) {
    throw 'Ошибка создания директории';
  }
  copyDirFunc(assetsDir, path.join(copyDir, 'assets'));
});

// ================ Чтение и изменение index.html ====================

fs.copyFile(path.join(__dirname, 'template.html'));
