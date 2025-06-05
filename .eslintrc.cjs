module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'airbnb',
    'prettier' // keep this last
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    // Project-specific overrides
    'react/react-in-jsx-scope': 'off',     // Not needed in React 17+
    'jsx-a11y/anchor-is-valid': 'off',     // We're using buttons instead of anchors
    'import/prefer-default-export': 'off',  // Allow single named exports
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.js'] }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'react/prop-types': 'off', // We're using TypeScript-like props in JS
    'react/button-has-type': 'off', // We'll handle button types manually
    'react/self-closing-comp': 'off', // Allow both <Component></Component> and <Component />
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and console.error
    'no-alert': 'warn', // Warn about alerts but don't fail
    'react/no-array-index-key': 'warn', // Warn about array index keys but don't fail
    'arrow-body-style': 'off', // Allow both arrow function styles
  },
  ignorePatterns: ['node_modules/', 'build/', 'dist/'],
};
