'use strict';

module.exports = ({ error, mistake, debug, improvement, style }) => ({
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

    // overridden eslint rules
    'brace-style': 'off',
    'comma-spacing': 'off',
    'default-param-last': 'off',
    'func-call-spacing': 'off',
    'indent': 'off',
    'no-array-constructor': 'off',
    'no-dupe-class-members': 'off',
    'no-empty-function': 'off',
    'no-extra-parens': 'off',
    'no-extra-semi': 'off',
    'no-magic-numbers': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'quotes': 'off',
    'require-await': 'off',
    'no-return-await': 'off', // ts: return-await
    'semi': 'off',
    'space-before-function-paren': 'off',

    // eslint overrides
    '@typescript-eslint/brace-style': [style, 'stroustrup', {
        allowSingleLine: true
    }],
    '@typescript-eslint/comma-spacing': style,
    '@typescript-eslint/default-param-last': improvement,
    '@typescript-eslint/func-call-spacing': style,
    '@typescript-eslint/indent': 'off', // handled by formatter
    '@typescript-eslint/no-array-constructor': mistake,
    '@typescript-eslint/no-dupe-class-members': error,
    '@typescript-eslint/no-empty-function': [mistake, {
        allow: ['methods']
    }],
    '@typescript-eslint/no-extra-parens': 'off',
    '@typescript-eslint/no-extra-semi': style,
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-unused-expressions': mistake,
    '@typescript-eslint/no-unused-vars': [mistake, {
        args: 'none',
        caughtErrors: 'all'
    }],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-useless-constructor': mistake,
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

    '@typescript-eslint/adjacent-overload-signatures': mistake,
    '@typescript-eslint/array-type': [style, {
        default: 'array'
    }],
    '@typescript-eslint/ban-ts-comment': mistake,
    '@typescript-eslint/ban-types': [mistake, {
        types: {
            'Function': null
        }
    }],
    '@typescript-eslint/class-literal-property-style': 'off',
    '@typescript-eslint/consistent-type-assertions': [mistake, {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow-as-parameter'
    }],
    '@typescript-eslint/consistent-type-definitions': [style, 'interface'],
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
        }
    ],
    '@typescript-eslint/no-dynamic-delete': mistake,
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': style,
    '@typescript-eslint/no-extraneous-class': mistake,
    '@typescript-eslint/no-inferrable-types': style,
    '@typescript-eslint/no-misused-new': mistake,
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': error,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-require-imports': improvement,
    '@typescript-eslint/no-this-alias': mistake,
    '@typescript-eslint/no-type-alias': 'off',
    '@typescript-eslint/no-var-requires': mistake,
    '@typescript-eslint/prefer-as-const': improvement,
    '@typescript-eslint/prefer-for-of': improvement,
    '@typescript-eslint/prefer-function-type': style,
    '@typescript-eslint/prefer-namespace-keyword': mistake,
    '@typescript-eslint/prefer-optional-chain': improvement,
    '@typescript-eslint/triple-slash-reference': [mistake, {
        path: 'never',
        types: 'prefer-import',
        lib: 'never'
    }],
    '@typescript-eslint/type-annotation-spacing': style,
    '@typescript-eslint/typedef': 'off',
    '@typescript-eslint/unified-signatures': improvement,

    // eslint overrides requiring type information
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-throw-literal': 'off',

    // requiring type information
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-for-in-array': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-unnecessary-qualifier': 'off',
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/require-array-sort-compare': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'off',
    '@typescript-eslint/unbound-method': 'off'
});
