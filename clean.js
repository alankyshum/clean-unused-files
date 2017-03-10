const glob = require('glob')
  , shell = require('shelljs')
  , sprintf = require("sprintf-js").sprintf
  , path = require('path')
  , fs = require('fs');

// SETTINGS
let config;
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch(e) {
  console.log('Please refer to config.example.json to create your own config.json');
  console.error(e);
  process.exit();
}

function searchFiles(path) {
  return new Promise((res, rej) => {
    const filesMatch = `${path}/**/*.{${config.fileExt.join(',')}}`;
    console.log(`Mathcing this pattern: ${filesMatch}`);
    glob(filesMatch, (err, files) => {
      if (err) {
        rej(err);
        return;
      }
      res(files.map(filePath => {
        let fileName = filePath.split('/');
        return {
          name: fileName[fileName.length-1],
          path: filePath
        }
      }));
    });
  });
}

function showFiles(searchResult) {
  function listUsed(used = true) {
    console.log('-'.repeat(config.fileNameLength), ` ${used ? 'Used' : 'Unused'} Files `, '-'.repeat(config.fileNameLength));
    searchResult[used ? 'used' : 'notUsed'].forEach(imgFile => {
      console.log(sprintf(`%${config.fileNameLength + 5}s | %s`, imgFile.name, imgFile.path));
    });
  }
  listUsed(true);
  listUsed(false);
  return searchResult;
}

searchFiles(config.imgFolder)
  .then(fileNames => {
    const searchResult = {
      used: [],
      notUsed: []
    };
    fileNames.sort().forEach(imgFile => {
      const filesThatMatches = shell.exec(`ag "${imgFile.name}" ${config.searchFolder} -c`, {
        silent: true
      }).stdout;
      searchResult[filesThatMatches ? 'used' : 'notUsed'].push(imgFile);
      const fileName = imgFile.name;
      filesThatMatches.split('\n').forEach(file => {
        console.log(sprintf(`%${config.fileNameLength}s ${file ? '::' : ''} %s`, imgFile.name, file));
        imgFile.name = ''; // show once only
      });
      imgFile.name = fileName;
    });
    console.log();
    return searchResult;
  }, err => { console.log(err); })
  .then(showFiles)
  .then(filteredFiles => {
    ['used', 'notUsed'].forEach(fileUse => {
      filteredFiles[fileUse].forEach(file => {
        let relativePath = file.path.replace(config.imgFolder, '').split('/');
        relativePath = relativePath.slice(0, relativePath.length-1);
        const targetFolder = path.join(config.outputFolder, fileUse, relativePath.join('/'));
        (!shell.test('-e', targetFolder)) && shell.mkdir('-p', targetFolder);
        shell.cp(file.path, targetFolder);
      });
    })
  });