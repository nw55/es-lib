'use strict';

module.exports = {
    env: {
        node: true,
        es2020: true
    },
    parserOptions: {
        sourceType: 'module'
    },
    overrides: [{
        files: ['./cli.js'],
        rules: {
            'linebreak-style': 'error'
        }
    }],
    ignorePatterns: ['.eslintrc.cjs']
};
