import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import trackEntity from '../entities/track.entity';
import { StatusCodes } from 'http-status-codes';
import artistyEntity from '../entities/artist.entity';
import fetchTrackMetadata from '../middlewares/fetchTrackMetadata';
import createSpotifyToken from '../middlewares/createSpotifyToken';

interface AddTrackRequest {
  isrc: string;
}

interface ArtistMetadata {
  name: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/tracks',
};

const router: Router = new Router(routerOpts);

router.get('/:track_isrc', async (ctx:Koa.Context) => {
  const trackRepo:Repository<trackEntity> = getRepository(trackEntity);

  const track = await trackRepo.findOne({ isrc: ctx.params.track_isrc });

  if (!track) {
    ctx.throw(StatusCodes.NOT_FOUND);
  }

  ctx.body = {
    data: { track },
  };
});

// router.get('/search?isrc:track_isrc', async (ctx:Koa.Context) => {
//   const trackRepo:Repository<trackEntity> = getRepository(trackEntity);
//   const track = await trackRepo.findOne(ctx.params.track_isrc);

//   if (!track) {
//     ctx.throw(StatusCodes.NOT_FOUND);
//   }

//   ctx.body = {
//     data: { track },
//   };
// });

router.post('/', createSpotifyToken(), fetchTrackMetadata(), async (ctx:Koa.Context) => {
  const trackRepo:Repository<trackEntity> = getRepository(trackEntity);

  const metadata = ctx.trackMetadata;
  const artistsList = metadata.artists || [];
  const artists:[artistyEntity] = artistsList.map((artist:ArtistMetadata) => {
    console.log('artist', artist.name);
    return { name: artist.name };
  });
  const track:trackEntity = trackRepo.create({
    artists,
    isrc: ctx.trackISRC,
    title: metadata.name,
    imageURI: metadata.album.images[0].url,
  });

  await trackRepo.save(track);

  ctx.response.status = StatusCodes.CREATED;
  ctx.body = {
    data: { track },
  };
});

export default router;
