'use strict';

const fs = require('fs-extra');
const path = require('path');
const { iterateLanguages, iterateUsages } = require('.');

function generateFile(dir, language, usage) {
    const file = path.resolve(dir, language + '.js');
    const content = `'use strict';
const { createConfig } = require('..');
module.exports = createConfig('${language}', '${usage}');
`;
    fs.writeFileSync(file, content, 'utf8');
}

function generateFiles() {
    for (const usage of iterateUsages()) {
        const dir = path.resolve(__dirname, usage);
        fs.emptyDirSync(dir);
        fs.ensureDirSync(dir);
        for (const language of iterateLanguages())
            generateFile(dir, language, usage);
    }
}

generateFiles();
