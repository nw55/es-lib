'use strict';

module.exports = {
    root: true,
    ignorePatterns: [
    ],
    env: {
        node: true,
        es2020: true
    },
    extends: ['@nw55/eslint-config/build/es'],
    rules: {
        'no-console': 'off'
    },
    overrides: [{
        files: ['./cli.js'],
        rules: {
            'linebreak-style': 'error'
        }
    }]
};
