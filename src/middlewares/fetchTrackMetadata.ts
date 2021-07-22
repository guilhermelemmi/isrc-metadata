import * as Koa from 'koa';
import { searchTracksByISRC } from '../services/spotifyService';
import { AddTrackRequest, TrackMetadata } from '../interfaces/interfaces';

export default function fetchTrackMetadata() {
  return async function fetchTrackMetadataMiddleware(ctx: Koa.Context, next: () => Promise<any>) {
    const { isrc } = ctx.request.body as AddTrackRequest;

    let tracks;
    try {
      tracks = await searchTracksByISRC(isrc, ctx.state.spotifyToken);
    } catch (err) {
      ctx.throw(err.status, err.message);
    }

    if (!tracks || !tracks.length) {
      ctx.throw(404, 'Track not found');
    }

    tracks.sort((a: TrackMetadata, b: TrackMetadata) => b.popularity - a.popularity);
    ctx.state.trackMetadata = tracks[0];
    ctx.state.trackISRC = isrc;

    return next();
  };
}
