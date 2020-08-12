'use strict';

module.exports = {
    root: true,
    ignorePatterns: [
        '/app/',
        '/dev/',
        '/lib/'
    ],
    parserOptions: {
        ecmaVersion: 2019
    },
    env: {
        node: true,
        es2017: true
    },
    extends: './lib/es'
};
