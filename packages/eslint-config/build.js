'use strict';

// specialized configuration that is based on the build (never dev) config app/es
// use this for build scripts and configuration scripts that are run with nodejs at dev/build time

module.exports = {
    extends: './app/es',
    parserOptions: {
        ecmaVersion: 2019
    },
    env: {
        node: true,
        es2017: true
    }
};
