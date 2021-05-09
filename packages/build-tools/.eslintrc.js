'use strict';

module.exports = {
    env: {
        node: true,
        es2020: true
    },
    overrides: [{
        files: ['./cli.js'],
        rules: {
            'linebreak-style': 'error'
        }
    }]
};
