'use strict';

module.exports = {
    preset: 'ts-jest',
    setupFilesAfterEnv: ['jest-extended/all'],
    testMatch: ['**/*-packages/*/test/**/*.ts'],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json'
        }
    }
};
