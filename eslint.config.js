const typescript = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');

module.exports = [
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json'
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': typescript
        },
        rules: {
            'curly': 'warn',
            'eqeqeq': 'warn',
            'no-throw-literal': 'warn',
            'semi': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn'
        }
    },
    {
        ignores: ['out/**', 'dist/**', '**/*.d.ts', 'node_modules/**']
    }
];