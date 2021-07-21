import * as Koa from 'koa';
import { StatusCodes } from 'http-status-codes';
import { searchTrackByISRC } from '../services/spotifyService';
import { AddTrackRequest, TrackMetadata } from '../interfaces/interfaces';

export default function fetchTrackMetadata() {
  return async function fetchTrackMetadataMiddleware(ctx: Koa.Context, next: () => Promise<any>) {
    const body = ctx.request.body as AddTrackRequest;

    let trackMetadata;
    try {
      trackMetadata = await searchTrackByISRC(body.isrc, ctx.state.spotifyToken);
    } catch (err) {
      ctx.throw(err.status, err.message);
    }

    if (
      !trackMetadata ||
      !trackMetadata.tracks ||
      !trackMetadata.tracks.items ||
      !trackMetadata.tracks.items.length
    ) {
      ctx.throw(404, 'Track not found');
    }

    const tracksList = trackMetadata.tracks.items;
    tracksList.sort((a: TrackMetadata, b: TrackMetadata) => b.popularity - a.popularity);
    ctx.state.trackMetadata = tracksList[0];
    ctx.state.trackISRC = body.isrc;

    return next();
  };
}
