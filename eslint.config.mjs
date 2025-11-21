import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable non-blocking warnings that don't break functionality
      "react/no-unescaped-entities": "off",  // Cosmetic HTML entities
      "@typescript-eslint/no-unused-vars": "warn", // Used vars warnings (not errors)
      "@typescript-eslint/no-explicit-any": "warn",  // Any type warnings (not errors)
    },
  },
];

export default eslintConfig;
