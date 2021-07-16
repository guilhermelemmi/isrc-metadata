import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import genericErrorHandler from '../middlewares/genericErrorHandler';
import tracksController from '../controllers/tracks.controller';

const app:Koa = new Koa();

app.use(genericErrorHandler());
app.use(koaBody());

app.use(tracksController.routes());
app.use(tracksController.allowedMethods());

app.on('error', console.error);

export default app;
