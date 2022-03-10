module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "quote-props": [2, "as-needed"],
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    semi: ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    indent: [2, 2, { SwitchCase: 1 }],
  },
}
