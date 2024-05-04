const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT ||5000;

// Middleware
app.use(cors())
app.use(express.json())


app.get("/", (req, res)=>{
  res.send("Hello world here come")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.cqokmno.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

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
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("productionDb");
    const productionCollection = database.collection("dailyIndividualProduction");

    app.get("/production", async(req, res)=>{
      const cursor = productionCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    
    app.post("/production", async(req, res)=>{
      const individualProduction = req.body;
      const result = await productionCollection.insertOne(individualProduction);
      res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



app.listen(port, ()=>{
    console.log(`listening to the port ${port}`)
})