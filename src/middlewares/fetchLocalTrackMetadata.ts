import * as Koa from 'koa';
import { getRepository, Repository, Like } from 'typeorm';
import { AddTrackRequest } from '../interfaces/interfaces';
import trackEntity from '../entities/track.entity';

export default function fetchLocalTrackMetadata() {
  return async function fetchLocalTrackMetadataMiddleware(ctx: Koa.Context) {
    const body = ctx.request.body as AddTrackRequest;
    const trackRepo: Repository<trackEntity> = getRepository(trackEntity);
    const track = await trackRepo.findOne({
      where: { isrc: body.isrc },
      relations: ['artists'],
    });

    if (track) {
      ctx.body = {
        data: { track },
      };
    }
  };
}
