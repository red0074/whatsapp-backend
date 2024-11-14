//sySIkahQzA08ahaG

//importing
import express from "express";
import mongoose, { mongo } from "mongoose";
import Messages from "./messages.js";
import Pusher from "pusher";
import cors from "cors";
import authRoutes from "./authRoutes.js";
import roomRoutes from "./roomRoute.js";
//appconfig
const app = express();
const port = process.env.PORT || 9000;

//->pusher code
const pusher = new Pusher({
  appId: "1837387",
  key: "7db3f04ba09f612cbcbd",
  secret: "3071a728100b8f189cda",
  cluster: "ap2",
  useTLS: true,
});
//middleware
app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"),
//     res.setHeader("Access-Control-Allow-Headers", "*"),
//     next();
// });
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
//db config
const connection_url =
  "mongodb+srv://pdinesh122003:sySIkahQzA08ahaG@cluster0.xi8tftc.mongodb.net/whatsapp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(connection_url);
//->for continuous stream bw frontend and mongodb
const db = mongoose.connection;
db.once("open", () => {
  console.log("db connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();
  //->once there is a change in collection this will fire up
  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const msgDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: msgDetails.name,
        message: msgDetails.message,
        timestamp: msgDetails.timestamp,
        received: msgDetails.received,
      });
    } else {
      console.log("Error triggering the pusher");
    }
  });
});
//api routes
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

//->send messages
app.post("/messages/new", async (req, res) => {
  try {
    const msg = req.body;
    const newMsg = await Messages.create(msg);
    res.status(201).send(newMsg);
  } catch (err) {
    res.status(500).send(err);
  }
});
//->get the data
app.get("/messages/sync", async (req, res) => {
  try {
    const msgs = await Messages.find();
    res.status(200).send(msgs);
  } catch (err) {
    res.status(500).send(err);
  }
});
//->room route
app.get("/api/private", async (req, res) => {
  res.json({ message: "This is a private route" });
});
//listener
app.listen(port, () => console.log(`Listening on localhost ${port}`));
