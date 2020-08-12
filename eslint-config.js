'use strict';

module.exports = {
    root: true,
    ignorePatterns: [
    ],
    parserOptions: {
        ecmaVersion: 2019
    },
    env: {
        node: true,
        es2017: true
    },
    extends: './build/es'
};
