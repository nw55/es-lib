'use strict';

function replaceInExtends(extendsValue) {
    if (typeof extendsValue === 'string')
        return extendsValue.replace('@nw55/eslint-config/build', '@nw55/eslint-config/dev');
    if (Array.isArray(extendsValue))
        return extendsValue.map(replaceInExtends);
    return extendsValue;
}

function replaceInConfig(config) {
    const devConfig = { ...config };
    if (config.extends)
        devConfig.extends = replaceInExtends(config.extends);
    if (config.overrides)
        devConfig.overrides = config.overrides.map(replaceInConfig);
    return devConfig;
}

module.exports = {
    useDevConfig(config) {
        return replaceInConfig(config);
    }
};
