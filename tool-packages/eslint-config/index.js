'use strict';

const esRules = require('./rules/es');
const tsRules = require('./rules/ts');
const tsTypecheckRules = require('./rules/ts-typecheck');

const buildOptions = require('./options/build');
const devOptions = require('./options/dev');

const validLanguages = ['es', 'ts', 'ts-typecheck'];
const validUsages = ['app', 'lib'];

const namedOptions = {
    'build': buildOptions,
    'dev': devOptions
};

let currentOptions;

function setOptions(options) {
    if (typeof options === 'string') {
        if (!Object.keys(namedOptions).includes(options))
            throw new Error('invalid options name: ' + options);
        currentOptions = namedOptions[options];
    }
    else {
        currentOptions = options;
    }
}

function getOptions() {
    // allow overriding via env
    if (Object.keys(namedOptions).includes(process.env.NW55_ESLINT_OPTIONS))
        return namedOptions[process.env.NW55_ESLINT_OPTIONS];

    // explicitly specified options if available
    if (currentOptions)
        return currentOptions;

    // when running in CI: build options
    if (process.env.CI === 'true')
        return buildOptions;

    // default: dev options
    return devOptions;
}

function createConfig(language, usage) {
    if (!validLanguages.includes(language))
        throw new Error('invalid language: ' + language);
    if (!validUsages.includes(usage))
        throw new Error('invalid usage: ' + usage);

    const usageObject = Object.fromEntries(validUsages.map(validUsage => [validUsage, validUsage === usage]));

    const options = getOptions();

    const result = {
        extends: [],
        rules: esRules(usageObject, options)
    };

    if (language === 'ts' || language === 'ts-typecheck') {
        result.extends.push('plugin:@typescript-eslint/base');

        Object.assign(result.rules, tsRules(usageObject, options));
        if (language === 'ts-typecheck')
            Object.assign(result.rules, tsTypecheckRules(usageObject, options));
    }

    for (const [key, value] of Object.entries(result.rules)) {
        if (!value)
            result.rules[key] = 'off';
    }

    return result;
}

module.exports = {
    setOptions,
    getOptions,
    createConfig,
    iterateLanguages: () => validLanguages[Symbol.iterator](),
    iterateUsages: () => validUsages[Symbol.iterator]()
};
