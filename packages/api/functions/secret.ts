import { api, secret } from '@nitric/sdk';
import { CorsService } from '../services/cors.service';

const cors = CorsService.getCorsConfig();
const chatApi = api('lol-im-secret', {
  middleware: [cors],
});

const apiKeyWritable = secret('api-key').for('put');

chatApi.put('/apikey', async (ctx) => {
  try {
    const queryValue: string[] = ctx.req.query.value;
    const value: string = Array.isArray(queryValue) ? queryValue[0] : queryValue;
    const latestVersion = await apiKeyWritable.put(value);

    ctx.res.status = 200;
    ctx.res.headers['Content-Type'] = ['application/json'];
    ctx.res.body = JSON.stringify({ version: latestVersion.version });

  } catch (error) {
    ctx.res.status = 500;
    ctx.res.headers['Content-Type'] = ['text/plain'];
    ctx.res.body = 'Server error';
  }
  return ctx;
});
