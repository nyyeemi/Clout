module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    // 1. React / React Native
    '^react$|^react-native$',

    // 2. Third-party libraries
    '<THIRD_PARTY_MODULES>',

    // --- Add Aliases Here (if you have them and want them separate) ---
    // "^@core/(?!.*\/types$)(.*)$",
    // "^@server/(?!.*\/types$)(.*)$",
    // "^@ui/(?!.*\/types$)(.*)$",

    // 3. ALL Relative Imports (../ and ./) - BUT NOT ending in /types.
    '^(?:\\.\\.|\\.)/(?!.*\\/types(?:\\/.*)?$)(.*)$',

    // 4. Catch-all for paths ending in /types (or containing /types/ within them)
    '.*\\/types(?:\\/.*)?$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
