import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository, Like } from 'typeorm';
import trackEntity from '../entities/track.entity';
import { StatusCodes } from 'http-status-codes';
import artistyEntity from '../entities/artist.entity';
import fetchTrackMetadata from '../middlewares/fetchTrackMetadata';
import createSpotifyToken from '../middlewares/createSpotifyToken';

const routerOpts: Router.IRouterOptions = {
  prefix: '/tracks',
};

const router: Router = new Router(routerOpts);

router.get('/:track_isrc', async (ctx: Koa.Context) => {
  const trackRepo: Repository<trackEntity> = getRepository(trackEntity);

  const track = await trackRepo.findOne({ isrc: ctx.params.track_isrc });

  if (!track) {
    ctx.throw(StatusCodes.NOT_FOUND);
  }

  ctx.body = {
    data: { track },
  };
});

router.get('/', async (ctx: Koa.Context) => {
  const query = ctx.request.query;

  if (!query || !query.artist) return (ctx.status = StatusCodes.BAD_REQUEST);

  const artistRepo: Repository<artistyEntity> = getRepository(artistyEntity);
  const artists = await artistRepo.find({
    select: ['name'],
    where: {
      name: Like(`%${query.artist}%`),
    },
    relations: ['track'],
  });

  if (!artists || !artists.length) return (ctx.status = StatusCodes.NOT_FOUND);

  const trackIds: number[] = [];
  for (let i = 0; i < artists.length; i += 1) {
    trackIds.push(artists[i].track.id);
  }

  const tracks = await getRepository(trackEntity)
    .createQueryBuilder('track')
    .where('track.id IN (:...ids)', { ids: trackIds })
    .getMany();

  if (!tracks || !tracks.length) {
    ctx.throw(StatusCodes.NOT_FOUND);
  }

  ctx.body = {
    data: { tracks },
  };
});

router.post('/', createSpotifyToken(), fetchTrackMetadata(), async (ctx: Koa.Context) => {
  const trackRepo: Repository<trackEntity> = getRepository(trackEntity);
  const artistRepo: Repository<artistyEntity> = getRepository(artistyEntity);

  const metadata = ctx.state.trackMetadata;
  const artistsList = metadata.artists || [];

  const track: trackEntity = trackRepo.create();
  track.isrc = ctx.state.trackISRC;
  track.title = metadata.name;
  track.imageURI = metadata.album.images[0].url;
  track.artists = [];

  for (let i = 0; i < artistsList.length; i += 1) {
    const artist: artistyEntity = artistRepo.create({ name: artistsList[i].name });
    track.artists.push(artist);
  }

  await trackRepo.save(track);

  ctx.response.status = StatusCodes.CREATED;
  ctx.body = {
    data: { track },
  };
});

export default router;
