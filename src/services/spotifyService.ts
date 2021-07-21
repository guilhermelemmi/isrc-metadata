import axios from 'axios';

export const createToken = async () => {
  const seed = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const hash = Buffer.from(seed).toString('base64');
  const data = 'grant_type=client_credentials';

  return await axios
    .post('https://accounts.spotify.com/api/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${hash}`,
      },
    })
    .then((res) => res.data);
};

export const searchTracksByISRC = async (isrc: string, token: string, fetchAll: boolean = true) => {
  let nextPageUrl = `https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track`;
  const allTracks = [];
  do {
    const { tracks } = await axios
      .get(nextPageUrl, {
        headers: {
          'Content-Type': 'application/',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    nextPageUrl = tracks.next;
    allTracks.push(...tracks.items);
  } while (fetchAll && nextPageUrl);

  return allTracks;
};
