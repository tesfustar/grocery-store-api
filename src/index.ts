import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const app: Application = express();



// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
