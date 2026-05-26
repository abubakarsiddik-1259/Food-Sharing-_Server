const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.rfyh9vd.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("foods_db");
    const foodsCollection = db.collection("foods");

    const foodRequestCollection = db.collection("foodRequests");

    //.....latest products..........
    app.get("/latest-foods", async (req, res) => {
      const cursor = await foodsCollection
        .find()
        .sort({ food_quantity: -1 })
        .limit(6);
      console.log("doooommmm", cursor);

      const result = await cursor.toArray();
      res.send(result);
    });

    //.....avalavel foods.......
    app.get("/foods", async (req, res) => {
      const result = await foodsCollection.find().toArray();
      res.send(result);
    });

    // add foods
    app.post("/foods", async (req, res) => {
      const food = req.body;

      const result = await foodsCollection.insertOne(food);

      res.send(result);
    });


    /////  details
    app.get("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const result = await foodsCollection.findOne({ _id: objectId });
      res.send({
        success: true,
        result,
      });
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
