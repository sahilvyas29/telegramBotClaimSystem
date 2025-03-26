import express from 'express';
import mongoose from 'mongoose';
import claimRouter from './routes/claimRoutes';
import whitelistRouter from './routes/whitelistRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.use('/claim', claimRouter);
app.use('/whitelist', whitelistRouter);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
