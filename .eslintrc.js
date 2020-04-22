module.exports = {
  extends: [
    'airbnb-base',
    // "eslint:recommended",
    'plugin:react/recommended',
  ],
  parser: 'babel-eslint',
  rules: {
    'import/prefer-default-export': 'off',
    indent: ['error', 4, { MemberExpression: off }],
    'no-nested-ternary': 'off',
    // "prettier/prettier": [
    //   1,
    //   {
    //     "useTabs": false,
    //     "printWidth": 120,
    //     "tabWidth": 2,
    //     "singleQuote": true
    //   }
    // ]
  },
};
