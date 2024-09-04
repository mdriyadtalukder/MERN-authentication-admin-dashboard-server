const express = require('express');
const app = express();
const cors = require('cors');
//const jwt = require('jsonwebtoken'); //
require('dotenv').config();  //
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); //
const nodemailer = require('nodemailer');

const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());


//-------------nodemailer---------------------------------
// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.ethereal.email",
    port: 5000,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "mdriyadtalukder69@gmail.com",
        pass: "kwbg klsm yjrq wonj",
    },
});

//----------------------------------------------------------


//--------------------------------------------------paste mongodb-----------------------------------------------------------------------------
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ovpcmcj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const usersCollection = client.db("MERN_Authentication_Booking_Site").collection("users");
        const currentUserCollection = client.db("MERN_Authentication_Booking_Site").collection("currentUser");
        const codeCollection = client.db("MERN_Authentication_Booking_Site").collection("code");

        //get all users
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // search user by email query and get
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await usersCollection.findOne(query);;
            res.send(result);
        })

        //get user by id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // add users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        //update  user 
        app.patch('/users/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {

                    isEmailVerified: data.isEmailVerified,
                    isPhoneNumberVerified: data.isPhoneNumberVerified

                }

            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
        //update  user 
        app.patch('/singleuser/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {


                    name: data.name,
                    email: data.email,
                    image: data.image,
                    password: data.password,
                    phoneNumber: data.phoneNumber,
                    isEmailVerified: data.isEmailVerified,
                    isPhoneNumberVerified: data.isPhoneNumberVerified,
                    role: data.role,
                }

            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
        //update  user pass
        app.patch('/userPass/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    password: data.password,
                }

            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        //update  user email
        app.patch('/userEmail/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    email: data.email,
                }

            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        //update  user name
        app.patch('/userName/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    name: data.name,
                }

            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        //update  user photo
        app.patch('/userPhoto/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    image: data.image,
                }

            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        //delete user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })





        //get current user email
        app.get('/currentUser', async (req, res) => {
            const result = await currentUserCollection.findOne();
            res.send(result);
        })

        //update current user email
        app.patch('/currentUser/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    email: data.email,
                }

            }
            const result = await currentUserCollection.updateOne(query, updatedDoc);
            res.send(result);
        })




        //get current user email
        app.get('/mailCode', async (req, res) => {
            const result = await codeCollection.findOne();
            res.send(result);
        })

        //update current user email
        app.patch('/mailCode/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    code: data.code,
                }

            }
            const result = await codeCollection.updateOne(query, updatedDoc);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

//------------------------------------------end mongodb-----------------------------------------------------------------------------------------------------------


//-------------nodemailer---------------------------------

app.post('/send-email', (req, res) => {
    const { email, code } = req.body;

    transporter.sendMail({
        from: "mdriyadtalukder69@gmail.com",
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}`

    }, (error, info) => {
        if (error) {
            console.log("error", error)
        }
        else {
            console.log('success', info)
        }
    });
});

//----------------------------------------------------------

app.get('/', (req, res) => {
    res.send('MERN authentication is sitting')
})


app.listen(port, () => {
    console.log(`MERN authentication  is sitting in port ${port} `)
})


