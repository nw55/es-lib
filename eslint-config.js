'use strict';

module.exports = {
    root: true,
    ignorePatterns: [
        '/dist/',
        '/lib/',
        '/out/'
    ],
    extends: ['@nw55/eslint-config/lib/ts-typecheck'],
    parserOptions: {
        project: './tsconfig.json'
    },
    overrides: [{
        files: ['test/**/*.ts'],
        parserOptions: {
            project: './test/tsconfig.json'
        }
    }]
};
