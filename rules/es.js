'use strict';

module.exports = ({ error, mistake, debug, improvement, style }) => ({
    // category: possible errors
    'for-direction': mistake,
    'getter-return': error,
    'no-async-promise-executor': mistake,
    'no-await-in-loop': 'off',
    'no-compare-neg-zero': mistake,
    'no-cond-assign': [mistake, 'except-parens'],
    'no-console': debug,
    'no-constant-condition': [mistake, {
        checkLoops: false
    }],
    'no-control-regex': 'off',
    'no-debugger': debug,
    'no-dupe-args': error,
    'no-dupe-else-if': mistake,
    'no-dupe-keys': error,
    'no-duplicate-case': mistake,
    'no-empty': [mistake, {
        allowEmptyCatch: true
    }],
    'no-empty-character-class': mistake,
    'no-ex-assign': mistake,
    'no-extra-boolean-cast': 'off',
    'no-extra-parens': 'off',
    'no-extra-semi': style,
    'no-func-assign': error,
    'no-import-assign': error,
    'no-inner-declarations': mistake,
    'no-invalid-regexp': error,
    'no-irregular-whitespace': [mistake, {
        skipStrings: false
    }],
    'no-misleading-character-class': mistake,
    'no-obj-calls': error,
    'no-prototype-builtins': mistake,
    'no-regex-spaces': mistake,
    'no-setter-return': error,
    'no-sparse-arrays': mistake,
    'no-template-curly-in-string': 'off',
    'no-unexpected-multiline': mistake,
    'no-unreachable': mistake,
    'no-unsafe-finally': mistake,
    'no-unsafe-negation': error,
    // 'no-useless-backreference': mistake, // not available yet
    'require-atomic-updates': mistake,
    'use-isnan': [error, {
        enforceForSwitchCase: true
    }],
    'valid-typeof': error,

    // category: best practices
    'accessor-pairs': [error, {
        enforceForClassMembers: true
    }],
    'array-callback-return': mistake,
    'block-scoped-var': 'off',
    'class-methods-use-this': 'off',
    'complexity': 'off',
    'consistent-return': mistake,
    'curly': [style, 'multi-or-nest', 'consistent'],
    'default-case': 'off',
    // 'default-case-last': style, // not available yet
    'default-param-last': improvement,
    'dot-location': [style, 'property'],
    'dot-notation': style,
    'eqeqeq': mistake,
    'grouped-accessor-pairs': [style, 'getBeforeSet'],
    'guard-for-in': mistake,
    'max-classes-per-file': 'off',
    'no-alert': debug,
    'no-caller': debug,
    'no-case-declarations': mistake,
    'no-constructor-return': error,
    'no-div-regex': 'off',
    'no-else-return': 'off',
    'no-empty-function': [mistake, {
        allow: ['methods']
    }],
    'no-empty-pattern': mistake,
    'no-eq-null': mistake,
    'no-eval': mistake,
    'no-extend-native': mistake,
    'no-extra-bind': mistake,
    'no-extra-label': improvement,
    'no-fallthrough': [mistake, {
        commentPattern: 'fall(?:s? )?through'
    }],
    'no-floating-decimal': style,
    'no-global-assign': error,
    'no-implicit-coercion': style,
    'no-implicit-globals': mistake,
    'no-implied-eval': mistake,
    'no-invalid-this': mistake,
    'no-iterator': error,
    'no-labels': [mistake, {
        allowLoop: true
    }],
    'no-lone-blocks': improvement,
    'no-loop-func': mistake,
    'no-magic-numbers': 'off',
    'no-multi-spaces': [style, {
        exceptions: {
            'Property': false
        }
    }],
    'no-multi-str': style,
    'no-new': mistake,
    'no-new-func': mistake,
    'no-new-wrappers': error,
    'no-octal': mistake,
    'no-octal-escape': mistake,
    'no-param-reassign': 'off',
    'no-proto': error,
    'no-redeclare': mistake,
    'no-restricted-properties': 'off',
    'no-return-assign': mistake,
    'no-return-await': mistake,
    'no-script-url': mistake,
    'no-self-assign': mistake,
    'no-self-compare': mistake,
    'no-sequences': mistake,
    'no-throw-literal': error,
    'no-unmodified-loop-condition': mistake,
    'no-unused-expressions': mistake,
    'no-unused-labels': mistake,
    'no-useless-call': improvement,
    'no-useless-catch': improvement,
    'no-useless-concat': improvement,
    'no-useless-escape': improvement,
    'no-useless-return': improvement,
    'no-void': style,
    'no-warning-comments': debug,
    'no-with': error,
    'prefer-named-capture-group': 'off',
    'prefer-promise-reject-errors': [error, {
        allowEmptyReject: true
    }],
    'prefer-regex-literals': improvement,
    'radix': 'off',
    'require-await': improvement,
    'require-unicode-regexp': 'off',
    'vars-on-top': 'off',
    'wrap-iife': [style, 'inside'],
    'yoda': style,

    // category: strict
    'strict': error,

    // category: variables
    'init-declarations': 'off',
    'no-delete-var': error,
    'no-label-var': improvement,
    'no-restricted-globals': 'off',
    'no-shadow': style,
    'no-shadow-restricted-names': error,
    'no-undef': ['error', {
        typeof: true
    }],
    'no-undef-init': style,
    'no-undefined': 'off',
    'no-unused-vars': [mistake, {
        args: 'none',
        caughtErrors: 'all'
    }],
    'no-use-before-define': 'off',

    // category: nodejs and commonjs
    'callback-return': 'off',
    'global-require': mistake,
    'handle-callback-err': 'off',
    'no-buffer-constructor': mistake,
    'no-mixed-requires': 'off',
    'no-new-require': mistake,
    'no-path-concat': mistake,
    'no-process-env': 'off',
    'no-process-exit': 'off',
    'no-sync': 'off',

    // category: stylistic issues
    'array-bracket-newline': [style, 'consistent'],
    'array-bracket-spacing': style,
    'array-element-newline': 'off',
    'block-spacing': style,
    'brace-style': [style, 'stroustrup'],
    'camelcase': style,
    'capitalized-comments': 'off',
    'comma-dangle': style,
    'comma-spacing': style,
    'comma-style': style,
    'computed-property-spacing': [style, 'never', {
        enforceForClassMembers: true
    }],
    'consistent-this': 'off',
    'eol-last': style,
    'func-call-spacing': style,
    'func-name-matching': 'off',
    'func-names': [style, 'as-needed'],
    'func-style': 'off',
    'function-call-argument-newline': 'off',
    'function-paren-newline': [style, 'consistent'],
    'id-blacklist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'implicit-arrow-linebreak': 'off',
    'indent': 'off', // handled better by formatter
    'jsx-quotes': [style, 'prefer-single'],
    'key-spacing': style,
    'keyword-spacing': style,
    'line-comment-position': 'off',
    'linebreak-style': 'off',
    'lines-around-comment': 'off',
    'lines-between-class-members': 'off',
    'max-depth': 'off',
    'max-len': 'off',
    'max-lines': 'off',
    'max-nested-callbacks': 'off',
    'max-params': 'off',
    'max-statements': 'off',
    'max-statements-per-line': style,
    'multiline-comment-style': 'off',
    'multiline-ternary': 'off',
    'new-cap': 'off',
    'new-parens': style,
    'newline-per-chained-call': 'off',
    'no-array-constructor': mistake,
    'no-bitwise': 'off',
    'no-continue': 'off',
    'no-inline-comments': 'off',
    'no-lonely-if': style,
    'no-mixed-operators': 'off',
    'no-mixed-spaces-and-tabs': style,
    'no-multi-assign': mistake,
    'no-multiple-empty-lines': [style, {
        max: 1,
        maxBOF: 1,
        maxEOF: 0
    }],
    'no-negated-condition': 'off',
    'no-nested-ternary': 'off',
    'no-new-object': improvement,
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-tabs': style,
    'no-ternary': 'off',
    'no-trailing-spaces': style,
    'no-underscore-dangle': 'off',
    'no-unneeded-ternary': improvement,
    'no-whitespace-before-property': style,
    'nonblock-statement-body-position': [style, 'below'],
    'object-curly-newline': style,
    'object-curly-spacing': [style, 'always'],
    'object-property-newline': 'off',
    'one-var': [style, 'never'],
    'one-var-declaration-per-line': 'off',
    'operator-assignment': improvement,
    'operator-linebreak': 'off',
    'padded-blocks': [style, 'never'],
    'padding-line-between-statements': 'off',
    'prefer-exponentiation-operator': improvement,
    'prefer-object-spread': improvement,
    'quote-props': [style, 'consistent'],
    'quotes': [style, 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true
    }],
    'semi': style,
    'semi-spacing': style,
    'semi-style': style,
    'sort-keys': 'off',
    'sort-vars': 'off',
    'space-before-blocks': style,
    'space-before-function-paren': [style, {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
    }],
    'space-in-parens': style,
    'space-infix-ops': style,
    'space-unary-ops': style,
    'spaced-comment': [style, 'always', {
        line: {
            markers: ['!']
        },
        block: {
            balanced: true
        }
    }],
    'switch-colon-spacing': style,
    'template-tag-spacing': style,
    'unicode-bom': mistake,
    'wrap-regex': 'off',

    // category: es6
    'arrow-body-style': [style, 'as-needed'],
    'arrow-parens': [style, 'as-needed'],
    'arrow-spacing': style,
    'constructor-super': error,
    'generator-star-spacing': [style, {
        named: 'after',
        anonymous: 'after',
        method: 'before'
    }],
    'no-class-assign': error,
    'no-confusing-arrow': 'off',
    'no-const-assign': error,
    'no-dupe-class-members': error,
    'no-duplicate-imports': improvement,
    'no-new-symbol': error,
    'no-restricted-exports': 'off',
    'no-restricted-imports': 'off',
    'no-this-before-super': error,
    'no-useless-computed-key': [improvement, {
        enforceForClassMembers: true
    }],
    'no-useless-constructor': mistake,
    'no-useless-rename': improvement,
    'no-var': mistake,
    'object-shorthand': [style, 'always', {
        avoidQuotes: true
    }],
    'prefer-arrow-callback': improvement,
    'prefer-const': improvement,
    'prefer-destructuring': 'off',
    'prefer-numeric-literals': improvement,
    'prefer-rest-params': improvement,
    'prefer-spread': improvement,
    'prefer-template': 'off',
    'require-yield': mistake,
    'rest-spread-spacing': style,
    'sort-imports': [style, {
        ignoreDeclarationSort: true
    }],
    'symbol-description': 'off',
    'template-curly-spacing': style,
    'yield-star-spacing': [style, 'after']
});
