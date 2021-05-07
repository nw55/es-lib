'use strict';

module.exports = {
    root: true,
    env: {
        node: true,
        es2020: true
    },
    extends: ['@nw55/eslint-config/build'],
    overrides: [{
        files: ['./cli.js'],
        rules: {
            'linebreak-style': 'error'
        }
    }]
};
