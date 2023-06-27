const express =require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 5000;

// authentication related imports::
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// middleware
app.use(cors());
app.use(express.json());


// Mongodb userName & Password are here...
// user: donationSystemDB
// password: AOg5u0MNSlYya4v2

// Mongodb connection starts from here....



const uri = `mongodb+srv://donationSystemDB:AOg5u0MNSlYya4v2@cluster0.zw95lnu.mongodb.net/?retryWrites=true&w=majority`;

// Secret key for JWT
const secretKey = 'razus super secret key';

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

        const userAuthentication=client.db('userAuthDB').collection('userCredentialsCollection')

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

    // Find method for searching specific user done...
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
    /*Donation information related database works ends here----------------------------------------------------------------*/ 


    /*User Authentication related works starts from here */
    /*------------------------------------------------------------*/

    // User Registration starts from here::::
    app.post('/register', (req, res) => {
        const { name,email, password } = req.body;
    console.log(req.body);
        // Hash the password using bcrypt
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            res.status(500).json({ error: 'Error hashing password' });
          } else {
            // Save the user in the MongoDB collection
            userAuthentication.insertOne({ name, password: hashedPassword,email }, (err) => {
              if (err) {
                res.status(500).json({ error: 'Error registering user' });
              } else {
                console.log(res.status(201).json({ message: 'User registered successfully' }));;
              }
            });
          }
        });
      });

    //   User login:::::::::::::::::::::::
    app.post('/login', (req, res) => {
        const { email, password } = req.body;
    userAuthentication.findOne({ email }, (err, user));
        // Find the user in the MongoDB collection
        userAuthentication.findOne({ email }, (err, user) => {
          if (err) {
            res.status(500).json({ error: 'Error finding user' });
          } else if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
          } else {
            // Compare the provided password with the hashed password in the database using bcrypt
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) {
                res.status(500).json({ error: 'Error comparing passwords' });
                console.log(err);
              } else if (!result) {
                res.status(401).json({ error: 'Invalid email or password' });
                
              } else {
                // Generate a JWT token
                const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ token });
                console.log(token);
                
              }
            });
          }
        });
      });
    

    
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
