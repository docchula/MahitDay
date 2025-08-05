module.exports = {
  extends: ['mantine', 'plugin:@next/next/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'linebreak-style': 0,
    'react/jsx-indent-props': 'off',
  },
};
