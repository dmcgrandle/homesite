module.exports = {
    // extends: "airbnb-base",
    parser: '@typescript-eslint/parser',
    // parserOptions: {
    //     project: './tsconfig.json'
    // },
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended'],
    env: {
        commonjs: true,
        node: true
        //    es6: true,
    },
    overrides: [
        {
            files: ['**/*.test.ts'],
            env: {
                jest: true
            }
            //  plugins: ["jest"],
            //  rules: {
            //    "jest/no-disabled-tests": "warn",
            //    "jest/no-focused-tests": "error",
            //    "jest/no-identical-title": "error",
            //    "jest/prefer-to-have-length": "warn",
            //    "jest/valid-expect": "error",
            //  }
        }
    ],
    rules: {
        // "@typescript-eslint/no-explicit-any": 0,
        // "prefer-destructuring": 0,
        // "no-console": 0,
        // "no-underscore-dangle": ["error", { "allow": ["_id"] }], // We need _id for mongodb client
    }
};
