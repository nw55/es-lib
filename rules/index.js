'use strict';

const esRules = require('./es');
const tsRules = require('./ts');
const tsTypecheckRules = require('./ts-typecheck');

module.exports = (name, options) => {
    const result = {
        extends: [],
        rules: esRules(options)
    };

    if (name === 'ts' || name === 'ts-typecheck') {
        result.extends.push('plugin:@typescript-eslint/base');

        Object.assign(result.rules, tsRules(options));
        if (name === 'ts-typecheck')
            Object.assign(result.rules, tsTypecheckRules(options));
    }

    return result;
};
