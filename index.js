const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)



const uri = "mongodb+srv://ih9066588:Y6CV5W4ex17IK7p2@cluster0.c25yoec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const roomsCollection = client.db("hotelBooking").collection("rooms");
    const BookingRoomsCollection = client.db("hotelBooking").collection("bookingRooms");

    // get all rooms in DB
    app.get("/rooms", async(req, res)=> {
        const cursor = roomsCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    // post korbo booking rooms
    app.post('/rooms', async (req, res) => {
      const room = req.body;

      // send user of mongoDB
      const result = await BookingRoomsCollection.insertOne(room);
      res.send(result)
  })

  // Availability update korbo
  app.put('/rooms/:id', async(req, res)=> {
    const id = req.params.id;
    const availability = req.body;
    console.log("id hoolo", id, "availability holo:", availability)
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true}
    const updatedAvailability = {
        $set: {
          Availability: availability.Availability
        }
    }
    const result = await roomsCollection.updateOne(filter, updatedAvailability, options)
    res.send(result)
})

    // get specifid rooms with Id
    app.get("/rooms/:id", async(req, res)=> {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await roomsCollection.findOne(query);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("Home server is running")
})

app.listen(port, () => {
    console.log(`Home server is runig ${port}`)
})