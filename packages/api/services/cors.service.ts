export class CorsService {

    static isPermittedOrigin(origin: string): boolean {
      try {
        const hostname: string = new URL(origin).hostname;
        const allowedDomains: string[] = process.env.ALLOWED_DOMAINS?.split(',') || ['localhost', '127.0.0.1'];
        return (allowedDomains.some(domain => {
          return hostname === domain || hostname.endsWith('.' + domain);
        }));
      } catch (error) {
        return false;
      }
    }

    static getCorsConfig(): any {
        const cors = (ctx, next) => {
            const { headers } = ctx.req;
            
            if(CorsService.isPermittedOrigin(headers.origin)) {
              ctx.res.headers['Access-Control-Allow-Origin'] = [ headers.origin ];
            }
            
            ctx.res.headers['Access-Control-Allow-Methods'] = [
              'GET, POST, PATCH, DELETE, OPTIONS',
            ];
          
            if (headers['Access-Control-Request-Headers']) {
              ctx.res.headers['Access-Control-Allow-Headers'] = Array.isArray(
                headers['Access-Control-Request-Headers']
              )
                ? headers['Access-Control-Request-Headers']
                : [headers['Access-Control-Request-Headers']];
            }
            
            return next(ctx);
        }
        return cors;
    }
}
  