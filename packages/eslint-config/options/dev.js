'use strict';

// use during development and for IDE highlighting

module.exports = {
    // things that are (almost) certainly wrong or unacceptable
    error: 'error',

    // things that are likely mistakes
    mistake: 'error',

    // things that should only be used during development / for debugging
    debug: 'warn',

    // best practices and recommended improvements
    improvement: 'warn',

    // style violations
    style: 'warn'
};
