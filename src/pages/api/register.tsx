import clientPromise from "@/pages/lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle_register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, movies } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('mydatabase'); // Replace with your database name
      const collection = db.collection('users');

      // Check if user already exists
      const existUser = await collection.findOne({ email: email });

      if (existUser) {
        //User already exists, send a 409 Conflict response
        return res.status(409).json({ message: 'User already exists' });
      } else {
        const result = await collection.insertOne({ firstName, lastName, email, password, movies });
        res.status(201).json({ message: 'User added successfully', data: result });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
