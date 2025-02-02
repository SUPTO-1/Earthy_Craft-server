const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://earthycraft-32095.web.app",
      "https://earthycraft-32095.firebaseapp.com"
    ],
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8iumwdu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftsCollection = client.db("earthyCraft").collection("crafts");
    const subcategoryCollection = client
      .db("earthyCraft")
      .collection("subcategory");
    app.get("/crafts", async (req, res) => {
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.findOne(query);
      res.send(result);
    });

    app.get("/crafts/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await craftsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/crafts", async (req, res) => {
      const newCrafts = req.body;
      console.log(newCrafts);
      const result = await craftsCollection.insertOne(newCrafts);
      res.send(result);
    });

    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCrafts = req.body;
      const craft = {
        $set: {
          itemName: updatedCrafts.itemName,
          subcategoryName: updatedCrafts.subcategoryName,
          price: updatedCrafts.price,
          photo: updatedCrafts.photo,
          description: updatedCrafts.description,
          stock: updatedCrafts.stock,
          rating: updatedCrafts.rating,
          customization: updatedCrafts.customization,
          time: updatedCrafts.time,
        },
      };
      const result = await craftsCollection.updateOne(filter, craft, options);
      res.send(result);
    });

    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/subcategory", async (req, res) => {
      const cursor = subcategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/subcategory/:subcategoryName", async (req, res) => {
      const subcategoryName = req.params.subcategoryName;
      const query = { subcategoryName: subcategoryName };
      const result = await craftsCollection.find(query).toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("earthy craft server is running");
});

app.listen(port, () => {
  console.log(`earthy craft server running on port ${port}`);
});
