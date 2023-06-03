#!/usr/bin/env node

async function main(scriptName, ...args) {
    const validScripts = ['fix-dts-bundle', 'workspace-versions'];

    if (validScripts.includes(scriptName)) {
        // eslint-disable-next-line global-require
        const script = await import('./scripts/' + scriptName + '.js');
        script.default(...args);
    }
    else if (scriptName) {
        console.error('Invalid script name: ' + scriptName);
    }
    else {
        console.error('No script name specified.');
    }
}

main(...process.argv.slice(2));
