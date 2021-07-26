import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository, Like } from 'typeorm';
import Artist from '../entities/artist.entity';

const routerOpts: Router.IRouterOptions = {
  prefix: '/artists',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  const artistRepo: Repository<Artist> = getRepository(Artist);
  const artists = await artistRepo.find({ relations: ['tracks'] });
  ctx.body = {
    data: { artists },
  };
});

export default router;
