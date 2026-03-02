import express from "express"
import axios from "axios"
import cors from "cors"
import Redis from "redis"

const redisClient= Redis.createClient()
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis: connect event fired"));
redisClient.on("ready", () => console.log("Redis: ready"));
await redisClient.connect(); 

const DEFAULT_EXPIRATION = 3600

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/photos",
    { params: { albumId } }
  )

  res.json(data)
})

app.get("/photos/:id", async (req, res) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
  )

  res.json(data)
})

// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId
//   const key = `photos?albumId=${albumId}`;

//   const cached = await redisClient.get(key); // returns string | null
//   if (cached) {
//     console.log("Cache Hit")
//     return res.json(JSON.parse(cached));
//   }

//   // fetch, then cache
//   console.log("Cache Miss")
//   const { data } = await axios.get(
//     "https://jsonplaceholder.typicode.com/photos",
//     { params: { albumId } }
//   )
//   await redisClient.set(key, JSON.stringify(data), { expiration: {type: "EX", value: DEFAULT_EXPIRATION} });
//   return res.json(data);
// })

app.listen(80)