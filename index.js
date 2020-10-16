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
    const addAdminCollection = client.db("creativeAgency").collection("addAdmin");

    //make a Admin part start
    app.post('/addMakeAdmin', (req, res) => {
        const makeAdmin = req.body;
        addAdminCollection.insertOne(makeAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        addAdminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })

    //make a Admin part end


    // review comment part start  
    // review comment post data
    app.post('/addReview', (req, res) => {
        const reviewDetails = req.body;
        reviewCollection.insertOne(reviewDetails)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    // review comment get data
    app.get('/reviewByData', (req, res) => {
        const reviewData = req.body;
        reviewCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    });
    // review comment part end

    // user order and services list part start
    //user order data post part
    app.post('/addUserDetails', (req, res) => {
        const userDetails = req.body;
        userDetailCollection.insertOne(userDetails)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    //Services list data get part
    app.get('/userDetailsByData', (req, res) => {
        const userDetailsData = req.body;
        userDetailCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    });
    // user order and services list part end


    //  admin Add Service part start
    //add service post
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const serviceDetail = req.body;
        addServiceCollection.insertOne(serviceDetail, file)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
        // console.log(name, file, description);
        file.mv(`${__dirname}/upService/${file.name}`, err => {
            if (err) {
                console.log(err);
                return res.status(500).send({ msg: 'Failed to upload Image' });
            }
            return res.send({ name: file.name, path: `${file.name}` })
        })
    });

    //add service get
    app.get('/serviceByData', (req, res) => {
        const serviceData = req.body;
        addServiceCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    });
    //  admin Add Service part start


});


app.listen(process.env.PORT || port)