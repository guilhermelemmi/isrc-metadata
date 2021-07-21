import 'dotenv/config';
import app from './app/app';
import connectToDb from './database/database.connection';

const PORT: number = Number(process.env.PORT) || 4000;

connectToDb()
  .then(() => {
    console.log('DB connected');
    console.log(`API is ready and listening on port ${PORT}`);
    app.listen(PORT);
  })
  .catch(console.error);
