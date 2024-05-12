const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())



// amader create kora middleware
const logger = async (req, res, next) => {
  // console.log("called: ", req.host, req.originalUrl)
  next();
}

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log("Value of token in middleware", token)

  // token na thakle
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access' })
  }
  // token thakle er moddhe asbe and ai token a kono vull thakele err hobe. sei err k akta message dia return kore diasi. 
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // error
    if (err) {
      console.log(err);
      return res.status(401).send({ message: 'unauthorized' })
    }

    // if token is valid then it would be decoded
    console.log("Value in the token: ", decoded)
    req.user = decoded;
    next()
  })
}



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

    // Token add korbo
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

      res.cookie('token', token, {
        httpOnly: true,

        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
      })
        .send({ success: true })
    })

    // token remove korbo, jokhon /logout path a jabe.
    app.post('/logout', async (req, res) => {
      const user = req.body;

      res.clearCookie('token', {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
      }).send({ success: true })
    })





    // ---------- 

    const roomsCollection = client.db("hotelBooking").collection("rooms");
    const BookingRoomsCollection = client.db("hotelBooking").collection("bookingRooms");
    const ReviewCollection = client.db("hotelBooking").collection("reviews");

    //--------

    // get all rooms in DB
    app.get("/rooms", async (req, res) => {
      const sort = req.query.sort;
      let options = {};
      if (sort) {
        options = { sort: { PricePerNight: sort === 'asc' ? 1 : -1 } }
        const result = await roomsCollection.find({}, options).toArray();
        return res.send(result)
      }
      // const cursor = roomsCollection.find();
      // const result = await cursor.toArray();
      const result = await roomsCollection.find().toArray();
      res.send(result)
    })

    // post korbo booking rooms
    app.post('/bookingRooms', async (req, res) => {
      const room = req.body;

      // send user of mongoDB
      const result = await BookingRoomsCollection.insertOne(room);
      res.send(result)
    })

    // Availability update korbo
    app.put('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const availability = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatedAvailability = {
        $set: {
          Availability: availability.Availability
        }
      }
      const result = await roomsCollection.updateOne(filter, updatedAvailability, options)
      res.send(result)
    })

    // get specifid rooms with Id
    app.get("/rooms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.findOne(query);
      res.send(result)
    })


    // get specifid rooms with email
    // app.get('/bookingRoom/:email', logger, verifyToken, async (req, res) => {
    app.get('/bookingRoom/:email', logger, verifyToken, async (req, res) => {
      const email = req.params.email;

      console.log("params er email:", req.params.email)
      console.log("user theke er email:", req.user.email)

      // check now user valid kina
      if (req.params.email !== req.user.email) {
        return res.status(403).send({ message: "Forbidden access" })
      }

      let query = {};
      if (req?.params?.email) {
        query = { userEmail: email }
      }

      const result = await BookingRoomsCollection.find(query).toArray();
      res.send(result)
    })


    // bookingRoom theke room delete korbo
    app.delete('/bookingRoom/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BookingRoomsCollection.deleteOne(query);
      res.send(result)
    })


    // MyBooking page theke data update korbo
    app.put('/bookingRoom/:id', async (req, res) => {
      const id = req.params.id;
      const { updateBookingDate } = req.body;
      console.log(updateBookingDate)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatedDate = {
        $set: {
          bookingDate: updateBookingDate,
        }
      };
      const result = await BookingRoomsCollection.updateOne(filter, updatedDate, options)
      res.send(result)
    })


    // post korbo review
    app.post('/reviews', async (req, res) => {
      const review = req.body;

      // send user of mongoDB
      const result = await ReviewCollection.insertOne(review);
      res.send(result)
    })


    // get all reviews in DB
    app.get("/reviews", async (req, res) => {
      const options = { sort: { date: -1 } }
      // const cursor = ReviewCollection.find();
      // const result = await cursor.toArray();
      // const cursor = ReviewCollection.find();
      const result = await ReviewCollection.find({}, options).toArray();
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {


  }
}
run().catch(console.dir);



// normay get
app.get("/", (req, res) => {
  res.send("Home server is running")
})

app.listen(port, () => {
  console.log(`Home server is runig ${port}`)
})