import clientPromise from "@/pages/lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function movies_list (req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const movies = await db
            .collection("movies")
            .find({})
            .sort({ metacritic: -1 })
            .limit(100)
            .toArray();
        res.status(200).json(movies);
        return movies;
    } catch (e) {
        res.status(500).send({ error: 'failed to fetch data' })
    }
}