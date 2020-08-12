'use strict';

// use as build step or before committing

module.exports = {
    // things that are (almost) certainly wrong or unacceptable
    error: 'error',

    // things that are likely mistakes
    mistake: 'error',

    // things that should only be used during development / for debugging
    debug: 'error',

    // best practices and recommended improvements
    improvement: 'warn',

    // style violations
    style: 'error'
};
