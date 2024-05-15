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
  origin: ['http://localhost:5174', 'http://localhost:5173', 'https://assignment-eleven-6f668.web.app', 'https://assignment-eleven-6f668.firebaseapp.com', 'https://room-intel.netlify.app'],
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



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c25yoec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // --------------------- Ager sort , filter and normaly all datal load er code: 
    // get all rooms in DB
    app.get("/rooms", async (req, res) => {

      // Price range a
      const from = parseInt(req.query.from);
      const to = parseInt(req.query.to);
      if (from && to) {
        console.log(from, to)
        const result = await roomsCollection.find({ PricePerNight: { $gte: from, $lte: to } }).toArray()
        return res.send(result)
      }
      // acsending - descending order
      const sort = req.query.sort;
      let options = {};
      if (sort) {
        options = { sort: { PricePerNight: sort === 'asc' ? 1 : -1 } }
        const result = await roomsCollection.find({}, options).toArray();
        return res.send(result)
      }
   
      const result = await roomsCollection.find().toArray();
      res.send(result)
    })

    /// --------------------------
  // -------AITA EDIT FOR DATE SORT
//   app.get("/rooms", async (req, res) => {
//     const query = {};

//     // Price range filter
//     const from = parseInt(req.query.from);
//     const to = parseInt(req.query.to);

//     if (from && to) {
//         query.PricePerNight = { $gte: from, $lte: to };
//     }

//     // Sort
//     const sort = req.query.sort;
//     let sortKey = {};

//     if (sort === 'asc') {
//         sortKey = { PricePerNight: 1 };
//     } else if (sort === 'dsc') {
//         sortKey = { PricePerNight: -1 };
//     }

//     try {
//         const result = await roomsCollection.find(query).sort(sortKey).toArray();
//         res.send(result);
//     } catch (err) {
//         console.log("Sorting error", err);
//         res.status(500).send("Internal Server Error");
//     }
// });


 

    //----------------------
    // app.get("/sort/:value", async (req, res) => {
    //   // acsending - descending order
    //   const sort = req.params.value;
    //   let options = { sort: { PricePerNight: sort === 'asc' ? 1 : -1 } }
    //   const result = await roomsCollection.find({}, options).toArray();
    //   return res.send(result)
    // })



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

      console.log("updateBookingDate", updateBookingDate)
      console.log("ai id er date update koro", id)
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

    // get specifid review with Id
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { RoomId: id };
      const result = await ReviewCollection.find(query).toArray();
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {


  }
}
run().catch(console.dir);



// //  normay get 
app.get("/", (req, res) => {
  res.send("Home server is running")
})

app.listen(port, () => {
  console.log(`Home server is runig ${port}`)
})