//import clientPromise from './_lib/mongodb-client';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
};
let client;
let clientPromise;
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (hot module replacement).
   if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
   }
   clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
}

export default async function handler(req, res) {
    const client = await clientPromise;
    res.status(200).json({ dbName: client.db().databaseName }); 
}
