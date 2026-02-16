import { build } from 'esbuild';

const isProd = process.env.NODE_ENV === 'production';

await build({
  entryPoints: ['src/server/index.ts'], // tu entry real
  bundle: true,
  platform: 'node',
  target: 'node20', // o node22; evita node24 si no es necesario en prod
  format: 'cjs',
  outfile: 'dist/server/index.cjs',
  sourcemap: isProd ? false : true,
  minify: isProd,
  logLevel: 'info',

  external: ['fs', 'path', 'url', 'crypto', 'http', 'https', 'zlib', 'stream'],

  loader: {
    '.json': 'json',
  },
}).catch(() => process.exit(1));
