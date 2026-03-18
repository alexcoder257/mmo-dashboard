export default {
  extends: ['@commitlint/config-conventional'],

  plugins: [
    {
      rules: {
        'prefix-commit-message': ({ raw }) => {
          const prefixPattern = /^\[DELL-\d+\]: .+/;
          return [
            prefixPattern.test(raw),
            `Your commit message should start with a ticket ID in the format "[DELL-XXX]: Commit message"`,
          ];
        },
      },
    },
  ],

  rules: {
    'header-max-length': [0, 'always', 200],
    'prefix-commit-message': [2, 'always'],
    'subject-empty': [0, 'never'],
    'type-empty': [0, 'never'],
  },
};
