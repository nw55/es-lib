'use strict';

module.exports = {
    root: true,
    ignorePatterns: [
        '/dist/',
        '/lib/',
        '/out/'
    ],
    extends: ['@nw55/eslint-config/build'],
    overrides: [{
        files: ['src/**/*.ts'],
        extends: ['@nw55/eslint-config/lib/ts-typecheck'],
        parserOptions: {
            project: './tsconfig.json'
        }
    }, {
        files: ['test/**/*.ts'],
        extends: ['@nw55/eslint-config/lib/ts-typecheck'],
        parserOptions: {
            project: './test/tsconfig.json'
        }
    }]
};
