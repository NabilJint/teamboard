import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const requireServerOnly = {
  meta: {
    type: "problem",
    docs: { description: "Require import 'server-only' at top of service files" },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const first = node.body[0];
        if (
          !first ||
          first.type !== "ImportDeclaration" ||
          first.source.value !== "server-only"
        ) {
          context.report({
            node,
            message: 'File must start with `import "server-only";`',
          });
        }
      },
    };
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.config({
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": true, "ts-expect-error": true }],
    },
  }),
  {
    files: ["src/server/services/**/*.ts"],
    plugins: {
      custom: {
        rules: {
          "require-server-only": requireServerOnly,
        },
      },
    },
    rules: {
      "custom/require-server-only": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
