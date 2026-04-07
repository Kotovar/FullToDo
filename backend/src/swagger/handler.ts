import type { IncomingMessage, ServerResponse } from 'http';
import { swaggerSpec } from './spec';

const SWAGGER_UI_VERSION = '5.32.2';

const swaggerHtml = `<!DOCTYPE html>
<html>
<head>
  <title>FullToDo API</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api-docs/spec.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
    });
  </script>
</body>
</html>`;

export const handleSwaggerUI = (_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(swaggerHtml);
};

export const handleSwaggerSpec = (
  _req: IncomingMessage,
  res: ServerResponse,
) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(swaggerSpec));
};
