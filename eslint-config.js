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
    overrides: [{
        files: ['./fix-dts-bundle.js'],
        rules: {
            'linebreak-style': 'error'
        }
    }]
};
