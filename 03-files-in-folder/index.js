const fs = require('fs');
const path = require('path');

const dirName = 'secret-folder';
const dirPath = path.join(__dirname, dirName);

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);
      fs.stat(filePath, (err, stats) => {
        const fileName = file.name;
        const fileExtension = path.extname(filePath).slice(1);
        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
      });
    }
  });
});
