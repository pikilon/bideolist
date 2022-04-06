const fs = require("fs")
const path = require("path")

const isFile = fileName => {
  return fs.lstatSync(fileName).isFile()
}

const getFilesInFolder = ({ foldersPaths = [], recursive = false, transformFilenameCallback = (fileName) => fileName }) => {
  const filesFullPath = [];
  const newFolders = [...foldersPaths];

  for (let folder of newFolders) {
    const filesAndFolders = fs.readdirSync(folder);
    for (let fileFolder of filesAndFolders) {
      const fullPath = path.join(folder, fileFolder);
      const isFile = fs.lstatSync(fullPath).isFile();
      if (isFile) filesFullPath.push(transformFilenameCallback(fullPath));
      if (recursive && !isFile) newFolders.push(fullPath);
    }
  }

  return filesFullPath;
}

module.exports = { getFilesInFolder }