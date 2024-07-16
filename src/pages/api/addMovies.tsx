import clientPromise from "@/pages/lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';
import { useContext } from "react";
import { LibraryContext, LibraryElements } from "../_app";


export default async function addMovies(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, movies } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('mydatabase'); // Replace with your database name
      const collection = db.collection('users');

      // Make sure if user already exists
      const user = await collection.findOne({ email: email });
      if (user) {
        const result = await collection.updateOne( { email: email },
            { $push: { movies: { $each: movies } } });
        res.status(201).json({ message: 'Movies added successfully', data: result }); 
      } else {
        return res.status(409).json({ message: 'Something went wrong' });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
