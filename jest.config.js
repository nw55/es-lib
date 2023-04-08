'use strict';

module.exports = {
    preset: 'ts-jest/presets/default-esm',
    setupFilesAfterEnv: ['jest-extended/all'],
    testMatch: ['**/*-packages/*/test/**/*.ts'],
    testPathIgnorePatterns: ['/_[^/]+\\.ts'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.test.json'
            }
        ]
    }
};
