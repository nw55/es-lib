'use strict';

const createRuleset = require('../rules');
const options = require('./options');

module.exports = createRuleset('ts-typecheck', options);
