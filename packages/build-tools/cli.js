#!/usr/bin/env node

'use strict';

const path = require('path');

function main(script, ...args) {
    const validScripts = ['fix-dts-bundle'];

    if (validScripts.includes(script)) {
        // eslint-disable-next-line global-require
        const scriptMain = require(path.resolve(__dirname, 'scripts', script));
        scriptMain(...args);
    }
    else if (script) {
        console.error('Invalid script name: ' + script);
    }
    else {
        console.error('No script name specified.');
    }
}

main(...process.argv.slice(2));
