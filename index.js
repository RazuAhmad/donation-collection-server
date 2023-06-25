const express =require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongodb userName & Password are here...
// user: donationSystemDB
// password: AOg5u0MNSlYya4v2

// Mongodb connection starts from here....



const uri = `mongodb+srv://donationSystemDB:AOg5u0MNSlYya4v2@cluster0.zw95lnu.mongodb.net/?retryWrites=true&w=majority`;

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

        

    // Read or Find/Query Method.::::

    app.get('/donators',async(req,res)=>{
        const query={};
        const cursor=totalDonators.find(query);
        const donators=await cursor.toArray();
        res.send(donators)
    })

    // Create(I mean Data Post) method done here::::..
        app.post('/donators', async(req,res)=>{
            const allDonators=req.body;
            
            const result=await totalDonators.insertOne(allDonators);
            res.send(result);
            
        })

    // Update method done here...
    app.get('/donators/:id',async(req,res)=>{
        const id=req.params.id;
        
        const query={ _id: new ObjectId(id) };
        const donator=await totalDonators.findOne(query);
        res.send(donator);
        console.log(donator)
    })

    // Put method for updating data....
    app.put('/donators/:id', async(req,res)=>{
        const id=req.params.id;
        const updatedDonator=req.body;
        const filter={ _id: new ObjectId(id) };
        const options= { upsert: true };
        const updateDoc={
            $set:{
                name: updatedDonator.name,
                donationCategory:updatedDonator.donationCategory,
                email: updatedDonator.email,
                amount: updatedDonator.amount
            }
        }
        const result = await totalDonators.updateOne(filter,updateDoc, options);
        console.log("updated user",updatedUser);
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
