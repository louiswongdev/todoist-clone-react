module.exports = {
  extends: [
    'airbnb-base', 
    "plugin:react/recommended"
  ],
  parser: 'babel-eslint',
  rules: {
    'import/prefer-default-export': 'off',
    // indent: ['error', 4, { MemberExpression: off }],
    'no-nested-ternary' : 'off',
  },
};
