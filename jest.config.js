module.exports = {
    preset: 'ts-jest',
    setupFilesAfterEnv: ['jest-extended'],
    testMatch: ['**/packages/*/test/**/*.ts'],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json'
        }
    }
};
