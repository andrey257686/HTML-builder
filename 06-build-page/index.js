const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

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

// ================ Создание index.html ====================

let testHtml = '';
let result = '';

const changeTemplate = async function () {
  let template = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  let components = await fsPromises.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true },
  );
  for (const file of components) {
    const fileName = path.basename(
      path.join(__dirname, 'components', file.name),
      '.html',
    );
    const fileNameRe = `{{${fileName}}}`;
    // const fileNameReC = /`{{${fileName}}}`/g;
    // console.log(fileNameReC);
    const dataFile = await fsPromises.readFile(
      path.join(__dirname, 'components', file.name),
      'utf-8',
    );
    template = template.replaceAll(fileNameRe, dataFile, '$&');
  }
  // console.log(template);
  await fsPromises.writeFile(path.join(copyDir, 'index.html'), template);
};

changeTemplate();
// fs.readFile(
//   path.join(__dirname, 'template.html'),
//   'utf8',
//   (err, dataTemplate) => {
//     if (err) {
//       throw 'Ошибка чтения шаблона';
//     }
//     testHtml = dataTemplate;
//     fs.readdir(
//       path.join(__dirname, 'components'),
//       { withFileTypes: true },
//       (err, files) => {
//         if (err) {
//           throw 'Ошибка чтения компонентов';
//         }
//         for (const file of files) {
//           const fileName = path.basename(
//             path.join(__dirname, 'components', file.name),
//             '.html',
//           );
//           const fileNameRe = `{{${fileName}}}`;
//           fs.readFile(
//             path.join(__dirname, 'components', file.name),
//             'utf-8',
//             (err, dataFile) => {
//               if (err) {
//                 throw 'Ошибка чтения файла';
//               }
//               // changeTemplate(dataTemplate, fileNameRe, dataFile);
//               testHtml = testHtml.replace(fileNameRe, dataFile);
//             },
//           );
//         }
//         console.log(testHtml);
//         // files.forEach((file) => {
//         // });
//       },
//     );
//   },
// );

// console.log(testHtml);

// ================ Создание bundle.css ====================

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');

const bundleName = 'style.css';

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
      readStream.on('data', (chunk) =>
        fs.appendFile(path.join(projectDir, bundleName), chunk, (err) => {
          if (err) {
            throw 'Ошибка записи style.css';
          }
        }),
      );
    }
  });
});
