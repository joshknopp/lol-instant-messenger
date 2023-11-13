export class CorsService {
    static getCorsConfig(): any {
        const cors = (ctx, next) => {
            const { headers } = ctx.req;
            
            // Allow known origins
            ctx.res.headers['Access-Control-Allow-Origin'] = [
                'https://joshknopp.com',
                'https://www.joshknopp.com'
            ];
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
  