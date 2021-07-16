import * as Koa from 'koa';
import { StatusCodes } from 'http-status-codes';

export default function genericErrorHandler() {
  return async function genericErrorHandlerMiddleware(
    ctx: Koa.Context,
    next: () => Promise<any>,
  ) {
    try {
      await next();
    } catch (error) {
      ctx.status = error.statusCode || error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      error.status = ctx.status;
      ctx.body = { error };
      ctx.app.emit('error', error, ctx);
    }
  };
}
