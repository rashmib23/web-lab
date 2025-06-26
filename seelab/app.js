// dbConnect.js

const { MongoClient } = require('mongodb');

// Connection URI — use '127.0.0.1' instead of 'localhost' for IPv4 compatibility
const uri = 'mongodb://127.0.0.1:27017';

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4, // Force IPv4
});

// Database and Collection name
const dbName = 'myProject';
const collectionName = 'documents';

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');

    // Get the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Example: Insert documents
    const insertResult = await collection.insertMany([
      { a: 1 }, { a: 2 }, { a: 3 }
    ]);
    console.log('📥 Insert Result:', insertResult);

    // Example: Find all documents
    const allDocs = await collection.find({}).toArray();
    console.log('🔍 All Documents:', allDocs);

    // Example: Update one document
    const updateResult = await collection.updateOne({ a: 2 }, { $set: { b: 99 } });
    console.log('♻️ Update Result:', updateResult);

    // Example: Delete one document
    const deleteResult = await collection.deleteOne({ a: 3 });
    console.log('❌ Delete Result:', deleteResult);

  } catch (err) {
    console.error('❌ MongoDB Error:', err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('🔒 Connection closed');
  }
}

// Run the connection function
run().catch(console.dir);
