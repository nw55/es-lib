'use strict';

// specialized configuration that is based on app/es
// use this for build scripts and configuration scripts that are run with nodejs at dev/build time

module.exports = {
    extends: './app/es',
    env: {
        node: true,
        es2020: true
    }
};
