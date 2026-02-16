import { build } from 'esbuild';
import { nodeExternals } from 'esbuild-plugin-node-externals';

const isProd = process.env.NODE_ENV === 'production';

await build({
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'cjs',
  outfile: 'dist/server/index.cjs',
  sourcemap: isProd ? false : true,
  minify: isProd,
  logLevel: 'info',

  external: ['fs', 'path', 'url', 'bcrypt', 'crypto', 'http', 'https', 'zlib', 'stream'],

  loader: {
    '.json': 'json',
  },

  plugins: [
    nodeExternals({
      include: [
        '@lytos/business-logic',
        '@lytos/contracts',
        '@lytos/constant-definitions',
        '@lytos/security',
        '@lytos/tools',
        '@lytos/core-modules',
      ],
    }),
  ],
}).catch(() => process.exit(1));
