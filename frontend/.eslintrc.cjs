module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  overrides: [
    {
      files: ["postcss.config.js", "tailwind.config.js"],
      env: {
        node: true
      },
      rules: {
        "no-undef": "off",
        "no-unused-vars": "off"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
}