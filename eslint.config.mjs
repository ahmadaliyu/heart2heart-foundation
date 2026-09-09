import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**", ".next-preview/**", ".next-verify/**", "next-env.d.ts", "node_modules/**", "public/sw.js"] },
  {
    rules: {
      // A leading underscore marks a parameter that is deliberately unused —
      // the request payloads in src/lib/demo.ts keep each endpoint's contract
      // visible at the call site while there is no API to send them to.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
];

export default eslintConfig;
