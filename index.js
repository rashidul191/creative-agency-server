const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4xle.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

// app.use(express.static('doctors'));
// app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userDetailCollection = client.db("creativeAgency").collection("userDetail");

    app.post('/addUserDetails', (req, res) => {
        const userDetails = req.body;
        //  console.log(userDetails);
        userDetailCollection.insertOne(userDetails)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/userDetailsByData', (req, res) => {
        const userDetailsData = req.body;
        console.log(userDetailsData.userDetailsData);
        userDetailCollection.find({ topic: userDetailsData.userDetailsData })
            .toArray((err, document) => {
                res.send(document);
            })

    });
    //   client.close();
});


app.listen(process.env.PORT || port)