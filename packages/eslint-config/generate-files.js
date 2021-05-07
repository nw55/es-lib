'use strict';

const fs = require('fs-extra');
const path = require('path');
const { iterateLanguages, iterateUsages } = require('.');

function generateFile(optionsDirDepth, dir, options, language, usage) {
    const file = path.resolve(dir, language + '.js');
    const indexPath = Array(optionsDirDepth + 1).fill('..').join('/');
    const content = `'use strict';
const { createConfig } = require('${indexPath}');
module.exports = createConfig('${language}', '${usage}', '${options}');
`;
    fs.writeFileSync(file, content, 'utf8');
}

function generateFiles(optionsDir, optionsDirDepth, options) {
    for (const usage of iterateUsages()) {
        const dir = path.resolve(__dirname, optionsDir, usage);
        fs.emptyDirSync(dir);
        fs.ensureDirSync(dir);
        for (const language of iterateLanguages())
            generateFile(optionsDirDepth, dir, options, language, usage);
    }
}

generateFiles('.', 0, 'build');
generateFiles('dev', 1, 'dev');
