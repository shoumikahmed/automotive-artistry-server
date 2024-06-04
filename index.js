const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = 5000;

app.use(cors());
app.use(express.json());


function createToken(user){

 const token = jwt.sign(
    {
      email: user.email
    },
    'secret', 
    { 
        expiresIn: '7d' 
    }
);
    return token
}

function verifyToken (req, res, next){
    const token = req.headers.authorization.split("")[1];
    const verify = jwt.verify(token, 'secret')
    if(!verify?.email){
        return res.send("you are not authorized")
    }
    req.user = verify.email
    next()
}


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
    const userDB = client.db("userDB");
    const carsCollection = carDB.collection("carsCollection");
    const userCollection = userDB.collection("userCollection");
// car 
app.post('/cars', verifyToken, async(req, res)=>{
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
app.patch('/cars/:id',verifyToken, async(req, res)=>{
    const id = req.params.id
    const updatedData = req.body
    const carsData = await carsCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updatedData}
    )
    res.send(carsData)
})
app.delete('/cars/:id', verifyToken, async(req, res)=>{
    const id = req.params.id
    const carsData = await carsCollection.deleteOne(
        {_id: new ObjectId(id)}
    )
    res.send(carsData)
})

// user
app.post('/user',verifyToken, async(req, res)=>{
    const user = req.body;
    const token = createToken(user)
    const isUserExist = await userCollection.findOne({email: user?.email})
    if(isUserExist?._id){
        return res.send({
            status: "success",
            message: " Login success",
            token
        })
    }
    await userCollection.insertOne(user)
    return res.send({token})
})



app.get('/user/get/:id', async(req,res)=>{
    const id = req.params.id
    const result = await userCollection.findOne({_id: new ObjectId(id)})
    res.send(result);
})

app.get('/user/:email', async(req,res)=>{
    const email = req.params.email
    const result = await userCollection.findOne({email})
    res.send(result);
})
app.patch('/user/:email', async(req,res)=>{
    const email = req.params.email
    const userData = req.body
    const result = await userCollection.updateOne({email}, {$set: userData}, {upsert: true})
    res.send(result);
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