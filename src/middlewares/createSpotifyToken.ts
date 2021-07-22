import * as Koa from 'koa';
import { createToken } from '../services/spotifyService';

export default function createSpotifyToken() {
  return async function createSpotifyTokenMiddleware(ctx: Koa.Context, next: () => Promise<any>) {
    try {
      const token = await createToken();
      ctx.state.spotifyToken = token?.access_token;
    } catch (err) {
      console.log('error fetching token', err);
    }
    return next();
  };
}
