// POST /api/new-meetup
import { MongoClient } from "mongodb"

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {

            const { title, image, address, description } = req.body
            
            const client = await MongoClient.connect(process.env.CONNECTION_URL)
            const db = client.db()
            
            const meetupsCollection = db.collection('meetups')
            const result = await meetupsCollection.insertOne(req.body)
            
            client.close()
            res.status(201).json({ message: 'meetup inserted' })
        } catch (err) {
            res.status(201).json({ error: err.message })
        }
    }
}