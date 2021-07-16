import 'dotenv/config';
import app from './app/app';
import connectToDb from './database/database.connection';

const PORT:number = Number(process.env.PORT) || 4000;

connectToDb().then(() => {
  console.log('DB CONNECTED');
  app.listen(PORT);
}).catch(console.error);
