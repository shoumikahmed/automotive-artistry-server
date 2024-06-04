const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://shoumikahmed103:SR0DN6ZmSg8TUyHd@cluster0.jqjswte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const carDB = client.db("carDB");
    const carsCollection = carDB.collection("carsCollection");
// car routes
app.post('/cars', async(req, res)=>{
    const carsData = req.body;
    const result = await carsCollection.insertOne(carsData)
    res.send(result)
})
app.get('/cars', async(req, res)=>{
    const carsData = carsCollection.find()
    const result = await carsData.toArray()
    res.send(result)
})
app.get('/cars/:id', async(req, res)=>{
    const id = req.params.id
    const carsData = await carsCollection.findOne({_id: new ObjectId(id)})
    res.send(carsData)
})
app.patch('/cars/:id', async(req, res)=>{
    const id = req.params.id
    const updatedData = req.body
    const carsData = await carsCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updatedData}
    )
    res.send(carsData)
})
app.delete('/cars/:id', async(req, res)=>{
    const id = req.params.id
    const carsData = await carsCollection.deleteOne(
        {_id: new ObjectId(id)}
    )
    res.send(carsData)
})


    console.log("Database is a connected");
  } finally {

  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('Route is working')
})

app.listen(port, (req, res)=>{
    console.log('App is listening on port :', port)
})

// shoumikahmed103
// SR0DN6ZmSg8TUyHd