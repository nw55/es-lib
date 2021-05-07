'use strict';

const buildConfig = require('./eslint-config');

module.exports = {
    ...buildConfig,
    extends: './dev/lib/es'
};
