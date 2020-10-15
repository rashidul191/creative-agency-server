const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4xle.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('upService'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working")
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userDetailCollection = client.db("creativeAgency").collection("userDetail");
    const reviewCollection = client.db("creativeAgency").collection("reviewDetails");
    const addServiceCollection = client.db("creativeAgency").collection("adminAddService");


    

    // review comment part start  
    app.post('/addReview', (req, res) => {
        const reviewDetails = req.body;
        //  console.log(userDetails);
        reviewCollection.insertOne(reviewDetails)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/reviewByData', (req, res) => {
        const reviewData = req.body;
        console.log(reviewData.reviewData);
        reviewCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    });

    // user order and services list part start
    //user order data post part
    app.post('/addUserDetails', (req, res) => {
        const userDetails = req.body;
        //  console.log(userDetails);
        userDetailCollection.insertOne(userDetails)
            .then(result => {
                // console.log(result);
                res.send(result.insertedCount > 0)
            })
    });

    //Services list data get part
    app.get('/userDetailsByData', (req, res) => {
        const userDetailsData = req.body;
        console.log(userDetailsData.userDetailsData);
        userDetailCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    });
    // user order and services list part end


});


app.listen(process.env.PORT || port)