import clientPromise from "@/pages/lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle_login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('mydatabase'); // Replace with your database name
      const collection = db.collection('users');

      // Check if user already exists
      const existUser = await collection.findOne({ email: email });
      if(!existUser) {
        return res.status(404);
      }
      if (existUser && password === existUser.password) {
        res.status(201).json({ data: existUser });
      } else {
        res.status(500).json({ message: 'Wrong email or password' });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
