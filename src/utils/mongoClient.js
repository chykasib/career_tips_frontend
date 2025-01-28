import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://career:IHfIPwrQxGtDknb8@cluster0.rx4i6uo.mongodb.net"; // Replace with your connection string
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
