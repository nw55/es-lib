'use strict';

module.exports = ({ app, lib }, { error, mistake, debug, improvement, style }) => ({
    // rules not needed or not useful with typescript
    'getter-return': 'off',
    'no-dupe-args': 'off',
    'no-dupe-keys': 'off',
    'no-func-assign': 'off',
    'no-import-assign': 'off',
    'no-inner-declarations': 'off',
    'no-setter-return': 'off',
    'no-unreachable': 'off',
    'valid-typeof': 'off',
    'array-callback-return': 'off',
    'no-unused-labels': 'off',
    'no-undef': 'off',
    'constructor-super': 'off',
    'no-class-assign': 'off',
    'no-const-assign': 'off',
    'no-new-symbol': 'off',
    'no-this-before-super': 'off',
    'consistent-return': 'off',

    // overridden eslint rules
    'brace-style': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'default-param-last': 'off',
    'func-call-spacing': 'off',
    'indent': 'off',
    'init-declarations': 'off',
    'keyword-spacing': 'off',
    'lines-between-class-members': 'off',
    'no-array-constructor': 'off',
    'no-dupe-class-members': 'off',
    'no-duplicate-imports': 'off',
    'no-empty-function': 'off',
    'no-extra-parens': 'off',
    'no-extra-semi': 'off',
    'no-invalid-this': 'off',
    'no-loop-func': 'off',
    'no-loss-of-precision': 'off',
    'no-magic-numbers': 'off',
    'no-redeclare': 'off',
    'no-restricted-imports': 'off',
    'no-shadow': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'padding-line-between-statements': 'off',
    'quotes': 'off',
    'require-await': 'off',
    'no-return-await': 'off', // ts: return-await
    'semi': 'off',
    'space-before-function-paren': 'off',
    'space-infix-ops': 'off',
    'space-before-blocks': 'off',

    // eslint overrides
    '@typescript-eslint/brace-style': [style, 'stroustrup', {
        allowSingleLine: true
    }],
    '@typescript-eslint/comma-dangle': style,
    '@typescript-eslint/comma-spacing': style,
    '@typescript-eslint/default-param-last': improvement,
    '@typescript-eslint/func-call-spacing': style,
    '@typescript-eslint/keyword-spacing': style,
    '@typescript-eslint/indent': 'off', // handled by formatter
    '@typescript-eslint/init-declarations': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-array-constructor': mistake,
    '@typescript-eslint/no-dupe-class-members': error,
    '@typescript-eslint/no-duplicate-imports': improvement,
    '@typescript-eslint/no-empty-function': [mistake, {
        allow: ['methods']
    }],
    '@typescript-eslint/no-extra-parens': 'off',
    '@typescript-eslint/no-extra-semi': style,
    '@typescript-eslint/no-invalid-this': mistake,
    '@typescript-eslint/no-loop-func': mistake,
    '@typescript-eslint/no-loss-of-precision': mistake,
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-redeclare': mistake,
    '@typescript-eslint/no-restricted-imports': 'off',
    '@typescript-eslint/no-shadow': style,
    '@typescript-eslint/no-unused-expressions': mistake,
    '@typescript-eslint/no-unused-vars': [mistake, {
        args: 'none',
        caughtErrors: 'all'
    }],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-useless-constructor': mistake,
    '@typescript-eslint/padding-line-between-statements': 'off',
    '@typescript-eslint/quotes': [style, 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true
    }],
    '@typescript-eslint/semi': style,
    '@typescript-eslint/space-before-function-paren': [style, {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
    }],
    '@typescript-eslint/space-infix-ops': style,
    '@typescript-eslint/space-before-blocks': style,

    '@typescript-eslint/adjacent-overload-signatures': mistake,
    '@typescript-eslint/array-type': [style, {
        default: 'array'
    }],
    '@typescript-eslint/ban-ts-comment': mistake,
    '@typescript-eslint/ban-tslint-comment': mistake,
    '@typescript-eslint/ban-types': [mistake, {
        types: {
            '{}': false
        },
        extendDefaults: true
    }],
    '@typescript-eslint/class-literal-property-style': 'off',
    '@typescript-eslint/consistent-generic-constructors': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/consistent-type-assertions': [mistake, {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow-as-parameter'
    }],
    '@typescript-eslint/consistent-type-definitions': [style, 'interface'],
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': [style, {
        accessibility: 'no-public',
        overrides: {
            parameterProperties: 'explicit'
        }
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': [style, {
        multiline: {
            delimiter: 'semi',
            requireLast: true
        },
        singleline: {
            delimiter: 'semi',
            requireLast: true
        }
    }],
    '@typescript-eslint/member-ordering': [style, {
        default: [
            'static-field',
            'static-method',
            'instance-field',
            'signature',
            'constructor',
            'instance-method'
        ]
    }],
    '@typescript-eslint/method-signature-style': 'off',
    '@typescript-eslint/naming-convention': [
        style,
        {
            selector: 'default',
            format: ['camelCase']
        },
        {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE']
        },
        {
            selector: 'parameter',
            format: ['camelCase']
        },
        {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase'],
            leadingUnderscore: 'require'
        },
        {
            selector: 'memberLike',
            modifiers: ['protected'],
            format: ['camelCase'],
            leadingUnderscore: 'require'
        },
        {
            selector: 'enumMember',
            format: ['PascalCase']
        },
        {
            selector: 'typeLike',
            format: ['PascalCase']
        },
        {
            selector: [
                'objectLiteralProperty',
                'objectLiteralMethod'
            ],
            format: null
        }
    ],
    '@typescript-eslint/no-confusing-non-null-assertion': style,
    '@typescript-eslint/no-duplicate-enum-values': mistake,
    '@typescript-eslint/no-dynamic-delete': mistake,
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': style,
    '@typescript-eslint/no-extraneous-class': mistake,
    '@typescript-eslint/no-implicit-any-catch': 'off',
    '@typescript-eslint/no-inferrable-types': style,
    '@typescript-eslint/no-invalid-void-type': [improvement, {
        allowAsThisParameter: true
    }],
    '@typescript-eslint/no-misused-new': mistake,
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': error,
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': error,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-require-imports': improvement,
    '@typescript-eslint/no-this-alias': mistake,
    '@typescript-eslint/no-type-alias': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': improvement,
    '@typescript-eslint/no-useless-empty-export': improvement,
    '@typescript-eslint/no-var-requires': mistake,
    '@typescript-eslint/parameter-properties': 'off',
    '@typescript-eslint/prefer-as-const': improvement,
    '@typescript-eslint/prefer-enum-initializers': 'off',
    '@typescript-eslint/prefer-for-of': improvement,
    '@typescript-eslint/prefer-function-type': style,
    '@typescript-eslint/prefer-literal-enum-member': 'off',
    '@typescript-eslint/prefer-namespace-keyword': mistake,
    '@typescript-eslint/prefer-optional-chain': improvement,
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    '@typescript-eslint/triple-slash-reference': [mistake, {
        path: 'never',
        types: 'prefer-import',
        lib: 'never'
    }],
    '@typescript-eslint/type-annotation-spacing': style,
    '@typescript-eslint/typedef': 'off',
    '@typescript-eslint/unified-signatures': [improvement, {
        ignoreDifferentlyNamedParameters: true
    }],

    // eslint overrides requiring type information
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-throw-literal': 'off',

    // requiring type information
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/consistent-type-exports': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-for-in-array': 'off',
    '@typescript-eslint/no-meaningless-void-operator': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-unnecessary-qualifier': 'off',
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-reduce-type-parameter': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'off',
    '@typescript-eslint/prefer-return-this-type': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/require-array-sort-compare': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'off',
    '@typescript-eslint/unbound-method': 'off'
});
