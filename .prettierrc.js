module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  parser: 'typescript',
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json'
      }
    }
  ]
};
