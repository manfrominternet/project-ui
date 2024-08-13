import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let client;
let db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db('test'); // Specify your test database name
});

afterAll(async () => {
  if (client) {
    await client.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Clean up database between tests
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Database Connection Tests', () => {
  test('should connect to the database and perform operations', async () => {
    // Check if `db` is defined
    expect(db).toBeDefined();

    // Insert a document into the collection
    const collection = db.collection('mydatabase');
    await collection.insertOne({ name: 'test' });

    // Find the document
    const doc = await collection.findOne({ name: 'test' });

    // Assert the document is not null and has the correct name
    expect(doc).not.toBeNull();
    expect(doc.name).toBe('test');
  });
});
