const express =require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 5000;

// // authentication related imports::
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// middleware
app.use(cors());
app.use(express.json());


// Mongodb userName & Password are here...
// user: donationSystemDB
// password: AOg5u0MNSlYya4v2

// Mongodb connection starts from here....





const uri = `mongodb+srv://donationSystemDB:AOg5u0MNSlYya4v2@cluster0.zw95lnu.mongodb.net/?retryWrites=true&w=majority`;

// Secret key for JWT



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
         client.connect();

        const totalDonators=client.db('allDonatorsDB').collection('allDonatorsCollection');

        const allVolunteers=client.db('volunteerDB').collection('volunteerInfoCollection')

    // Read or Find/Query Method.::::

    app.get('/donators',async(req,res)=>{
        const query={};
        const cursor=totalDonators.find(query);
        const donators=await cursor.toArray();
        res.send(donators)
    })

    // Find/Query Specific donation
    app.get('/email/:email', async(req,res)=>{
        const email =req.params.email;

        const query={email:email};
        const cursor = totalDonators.find(query);
        const donators=await cursor.toArray();
        res.send(donators);
        
    })

    // DELETE donator by id:;
    app.delete('/donators/deleteSingleItem/:id', async(req,res)=>{
        const id =req.params.id;

        const query={ _id: new ObjectId(id) };
        const donator = await totalDonators.deleteOne(query);
        
        res.send(donator);
    })


    // Create(I mean Data Post) method done here::::
        app.post('/donators', async(req,res)=>{
            const allDonators=req.body;
            
            const result=await totalDonators.insertOne(allDonators);
            res.send(result);
            
        })


    // Create(Data Post method) for voluteer registration::::
    app.post('/volunteers', async(req,res)=>{
        const volunteerInfo=req.body;
            
            const result=await allVolunteers.insertOne(volunteerInfo);
            res.send(result);
    })


    // Find method for searching specific user done...
    app.get('/donators/:id',async(req,res)=>{
        const id=req.params.id;
        
        const query={ _id: new ObjectId(id) };
        const donator=await totalDonators.findOne(query);
        res.send(donator);
        
    })


    // Put method for updating data....
    app.put('/donators/:id', async(req,res)=>{
        const id=req.params.id;
        const updatedDonator=req.body;
        const filter={ _id: new ObjectId(id) };
        const options= { upsert: true };
        const updateDoc={
            $set:{
                name: updatedDonator?.name,
                donationCategory:updatedDonator.donationCategory,
                email: updatedDonator.email,
                amount: updatedDonator.amount,
                date: updatedDonator.date,
                time:updatedDonator.time,
                paymentMethod:updatedDonator.paymentMethod
            }
        }
        const result = await totalDonators.updateOne(filter,updateDoc, options);
        console.log("updated donator",updatedDonator);
        res.json(result)
    })
    
    
    } finally {
      
    }
  }


run().catch(err=>console.log(err));




app.get('/',(req,res)=>{
    res.send("Hellow from node mongo crud server. Sing hey ho, sing hey ho. This is something so profound.")
});


app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})
