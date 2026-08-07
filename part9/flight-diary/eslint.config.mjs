import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // Reglas para JavaScript
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...eslint.configs.recommended,
  },

  // Reglas para TypeScript
  ...tseslint.config({
    files: ["**/*.ts"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "no-case-declarations": "off",
    },
  }),
];
