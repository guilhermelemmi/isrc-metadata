import * as Koa from 'koa';
import { getRepository, Repository, Like } from 'typeorm';
import { AddTrackRequest } from '../interfaces/interfaces';
import Track from '../entities/track.entity';

export default function fetchLocalTrackMetadata() {
  return async function fetchLocalTrackMetadataMiddleware(
    ctx: Koa.Context,
    next: () => Promise<any>
  ) {
    const { isrc } = ctx.request.body as AddTrackRequest;
    const trackRepo: Repository<Track> = getRepository(Track);
    const track = await trackRepo.findOne({
      where: { isrc },
      relations: ['artists'],
    });

    if (!track) {
      return next();
    }

    ctx.body = {
      data: { track },
    };
  };
}
