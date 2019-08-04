const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const connectToDatabase = async () => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'update-example';
  const client = new MongoClient(url, { useNewUrlParser: true });

  await client.connect();
  console.log('Connected to Mongo');
  const db = client.db(dbName);

  // Start by inserting some documents in the collection
  const collection = db.collection('names');
  console.log('Using collection names');
  return { client, collection };
};

const insertTheDocuments = async (collection) => {
  console.log('Inserting documents...');
  const results = await collection.insertMany([
    { name: 'Joshua Burke' },
    { name: 'Alex Horner' },
    { name: 'Benny Boas' },
  ]);
  // Check to make sure that three documents were inserted...
  assert.equal(3, results.result.n);
  return { results };
};

const deleteAll = async (collection) => {
  console.log('Deleting documents');
  const results = await collection.deleteMany({});
  console.log(`Deleted documents, count: ${results.deletedCount}`);
};

const updateExample = async (collection) => {
  console.log('Updating documents...');
  try {
    let { results } = await insertTheDocuments(collection);

    // Update one of the existing documents
    results = await collection.findOneAndUpdate(
      { name: 'Joshua Burke' },
      { $set: { name: 'Joshua James Burke' } },
      { returnOriginal: false },
    );
    // Check to make sure that there are still three documents.
    assert.equal('Joshua James Burke', results.value.name);
  } catch (err) {
    console.log('Something went wrong', err.name, err.stack);
  }
  console.log('Finished with everything.');
};

(async () => {
  const { client, collection } = await connectToDatabase();
  await deleteAll(collection); // delete any existing documents...
  await updateExample(collection); // Run the example ...
  await deleteAll(collection);
  client.close();
  process.exit()
})();
