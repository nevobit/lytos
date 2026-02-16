import { type FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import { type OpenAPIV3_1 } from 'openapi-types';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import * as schemas from "./schemas";

const isProduction = process.env.NODE_ENV === 'production';
const routesPath = !isProduction
  ? join(__dirname, 'routes')
  : join(__dirname, '..', 'routes');

const yamlFiles = existsSync(routesPath)
  ? readdirSync(routesPath).filter(file => file.endsWith('.yaml'))
  : [];

const paths: OpenAPIV3_1.PathsObject = {};

yamlFiles.forEach(file => {
  const fileContent = readFileSync(join(routesPath, file), 'utf8');
  const yamlContent = yaml.load(fileContent) as OpenAPIV3_1.PathsObject;
  Object.assign(paths, yamlContent);
});

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      title: '@lytos OpenAPI',
      description: 'API Documentation with OpenAPI',
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:8000/api/v1' }],
    paths: paths,
    components: {
      schemas: schemas as Record<string, OpenAPIV3_1.SchemaObject>
    },
  },
  hideUntagged: true
};

export const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
  config: {},
};