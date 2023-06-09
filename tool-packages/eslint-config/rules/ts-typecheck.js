'use strict';

module.exports = ({ app, lib }, { error, mistake, debug, improvement, style }) => ({
    // overridden eslint rules (that can be used with ts)
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'no-throw-literal': 'off',

    // eslint overrides
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/require-await': improvement,
    '@typescript-eslint/return-await': mistake,
    '@typescript-eslint/no-implied-eval': mistake,
    '@typescript-eslint/no-throw-literal': [error, {
        'allowThrowingAny': false,
        'allowThrowingUnknown': false
    }],

    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/consistent-type-exports': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-floating-promises': mistake,
    '@typescript-eslint/no-for-in-array': mistake,
    '@typescript-eslint/no-meaningless-void-operator': 'off',
    '@typescript-eslint/no-misused-promises': [mistake, {
        checksVoidReturn: true,
        checksConditionals: true
    }],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': mistake,
    '@typescript-eslint/no-unnecessary-condition': [mistake, {
        allowConstantLoopConditions: true
    }],
    '@typescript-eslint/no-unnecessary-qualifier': mistake,
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': improvement,
    '@typescript-eslint/no-unsafe-assignment': mistake,
    '@typescript-eslint/no-unsafe-call': mistake,
    '@typescript-eslint/no-unsafe-member-access': mistake,
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    '@typescript-eslint/prefer-includes': improvement,
    '@typescript-eslint/prefer-nullish-coalescing': [improvement, {
        ignoreConditionalTests: false,
        ignoreMixedLogicalExpressions: false
    }],
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-reduce-type-parameter': improvement,
    '@typescript-eslint/prefer-regexp-exec': improvement,
    '@typescript-eslint/prefer-return-this-type': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': improvement,
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/require-array-sort-compare': [mistake, {
        ignoreStringArrays: true
    }],
    '@typescript-eslint/restrict-plus-operands': [mistake, {
        checkCompoundAssignments: true
    }],
    '@typescript-eslint/restrict-template-expressions': [mistake, {
        allowBoolean: true
    }],
    '@typescript-eslint/strict-boolean-expressions': mistake,
    '@typescript-eslint/switch-exhaustiveness-check': mistake,
    '@typescript-eslint/unbound-method': [mistake, {
        ignoreStatic: true
    }]
});
