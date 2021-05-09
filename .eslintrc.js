'use strict';

module.exports = {
    root: true,
    ignorePatterns: [
        '**/dist/',
        '**/lib/'
    ],
    // default: build config for all js files
    extends: ['@nw55/eslint-config/build'],
    overrides: [{
        // for typescript source and test files: lib/ts-typecheck
        files: ['**/packages/*/src/**/*.ts', '**/packages/*/test/**/*.ts'],
        extends: ['@nw55/eslint-config/lib/ts-typecheck'],
        parserOptions: {
            project: [
                'packages/*/src/tsconfig.json',
                'tsconfig.test.json'
            ]
        }
    }]
};
