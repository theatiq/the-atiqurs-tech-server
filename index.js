require("dotenv").config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hnhnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const blogsCollection = client.db("blogsDB").collection('blogs')
        const wishListCollection = client.db("blogsDB").collection("wishList")

        app.get("/reviews", async (req, res) => {
            const cursor = blogsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // For home Page
        app.get("/reviewsHome", async (req, res) => {
            const cursor = blogsCollection.find().sort({ rating: -1 }).limit(6)
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get("/review/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query)
            res.send(result)
        })
        app.get("/watchList", async (req, res) => {
            const cursor = wishListCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get("/watchList/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: id }
            const result = await wishListCollection.findOne(query)
            res.send(result)
        })



        // My Reviews
        app.get("/myReviews", async (req, res) => {
            const email = req.query.email
            const filter = { email }
            const result = await blogsCollection.find(filter).toArray()
            res.send(result)
        })
        // My Watch List
        app.get("/myWatchList", async (req, res) => {
            const email = req.query.email
            const filter = { email }
            const result = await wishListCollection.find(filter).toArray()
            res.send(result)
        })

        // Add New Post
        app.post("/addPost", async (req, res) => {
            const newPost = req.body
            const result = await blogsCollection.insertOne(newPost)
            res.send(result)
        })


        app.post("/watchList", async (req, res) => {
            // const id = req.params.id
            const watchList = req.body
            console.log(watchList)
            const result = await wishListCollection.insertOne(watchList)
            res.send(result)
        })
        // Update a Post
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const newPost = req.body
            const updatedPost = {
                $set: newPost
            }
            const result = await blogsCollection.updateOne(filter, updatedPost, options)
            res.send(result)
        })
        // Delete a Blog
        app.delete("/blog/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.deleteOne(query)
            res.send(result)
        })
        // Delete from Watch List
        app.delete("/watchList/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: id }
            const result = await wishListCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // todo Comment it before deployment.
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Assignment-11 server is running smoothly.......")
})

app.listen(port, () => {
    console.log(`Assignment-11 server is running on Port: ${port}`)
})

