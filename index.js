'use strict';

const esRules = require('./rules/es');
const tsRules = require('./rules/ts');
const tsTypecheckRules = require('./rules/ts-typecheck');

const validLanguages = ['es', 'ts', 'ts-typecheck'];
const validUsages = ['app', 'lib'];
const validOptionNames = ['build', 'dev'];

function createConfig(language, usage, options) {
    if (!validLanguages.includes(language))
        throw new Error('invalid language: ' + language);
    if (!validUsages.includes(usage))
        throw new Error('invalid usage: ' + usage);
    if (typeof options === 'string') {
        if (!validOptionNames.includes(options))
            throw new Error('invalid named options: ' + options);
        // eslint-disable-next-line global-require
        options = require('./options/' + options);
    }

    const usageObject = Object.fromEntries(validUsages.map(validUsage => [validUsage, validUsage === usage]));

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

function useDevInExtends(extendsValue) {
    if (typeof extendsValue === 'string') {
        for (const usage of validUsages)
            extendsValue = extendsValue.replace('@nw55/eslint-config/' + usage + '/', '@nw55/eslint-config/dev/' + usage + '/');
        return extendsValue;
    }
    if (Array.isArray(extendsValue))
        return extendsValue.map(useDevInExtends);
    return extendsValue;
}

function useDevInConfig(config) {
    const devConfig = { ...config };
    if (config.extends)
        devConfig.extends = useDevInExtends(config.extends);
    if (config.overrides)
        devConfig.overrides = config.overrides.map(useDevInConfig);
    return devConfig;
}

module.exports = {
    createConfig,
    useDevConfig: useDevInConfig,
    iterateLanguages: () => validLanguages[Symbol.iterator](),
    iterateUsages: () => validUsages[Symbol.iterator]()
};
