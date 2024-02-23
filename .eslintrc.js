/* eslint-disable @typescript-eslint/no-var-requires */
const stylistic = require('@stylistic/eslint-plugin')

const customized = stylistic.configs.customize({
  arrowParens: false,
  commaDangle: 'always-multiline',
  indent: 2,
  jsx: true,
  quoteProps: 'consistent-as-needed',
  semi: false,
})

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:perfectionist/recommended-alphabetical',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  overrides: [
    {
      env: { node: true },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: { sourceType: 'script' },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    '@stylistic',
    '@typescript-eslint',
    'hooks',
    'react',
    'sort-destructure-keys',
    'sort-react-dependency-arrays',
    'unused-imports',
  ],
  rules: {
    ...customized.rules,
    '@stylistic/arrow-parens': 'off',
    '@stylistic/brace-style': 'off',
    '@stylistic/js/arrow-parens': 'off',
    '@stylistic/jsx-closing-tag-location': 'error',
    '@stylistic/jsx-curly-newline': ['error', { multiline: 'forbid', singleline: 'forbid' }],
    '@stylistic/jsx-equals-spacing': ['error', 'never'],
    '@stylistic/jsx-max-props-per-line': ['error', { maximum: 3 }],
    '@stylistic/jsx-one-expression-per-line': 'off',
    '@stylistic/jsx-pascal-case': ['error', { allowLeadingUnderscore: true, allowNamespace: true }],
    '@stylistic/jsx-props-no-multi-spaces': 'error',
    '@stylistic/jsx-wrap-multilines': 'error',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/ts/arrow-parens': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'arrow-parens': 'off',
    'hooks/sort': [
      'error',
      {
        groups: ['useReducer', 'useContext', 'useState', 'useRef', 'useDispatch', 'useCallback', 'useEffect'],
      },
    ],
    'linebreak-style': ['warn', 'unix'],
    'react/react-in-jsx-scope': 'off',
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
  },
  settings: { react: { version: 'detect' } },
}