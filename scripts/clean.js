const fse = require('fs-extra');
const { path } = require('./path');

/**
 * Clean output directory and copy extension manifest
 * @param {Object} path
 */
function clean(path) {
  fse.removeSync(path.outDir);
  fse.ensureDirSync(path.outDir);
  fse.copyFileSync(
    `${path.inputDir}manifest.json`,
    `${path.outDir}manifest.json`
  );
}

clean(path);
