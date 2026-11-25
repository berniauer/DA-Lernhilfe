import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'src/**/*', 'scripts/**/*', 'originale/**/*', 'app/**/*'],
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
