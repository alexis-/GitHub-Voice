module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'array-bracket-spacing': 0,
    'class-methods-use-this': 0,
    'function-paren-newline': 0,
    'no-multi-assign': 0,
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-var-requires': 0,
    'max-len': [
      'error',
      {
        code: 150,
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
