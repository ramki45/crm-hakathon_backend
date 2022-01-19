const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://ramki45:pandian5!@cluster0.vna1k.mongodb.net/?retryWrites=true&w=majority";
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');

const secret = "1NBTK";
app.use(express.json());
app.use(cors({
    origin: "*"
}))


//for registration

app.post('/register', async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        await db.collection('crm').insertOne(req.body);
        connection.close();
        res.json({ message: "customer created" })
    } catch (error) {
        console.log('customer error')
    }

})

//to get register user detail
app.get('/userlist',async function (req,res){

        try {
            let connection = await mongoClient.connect(URL);
            let db = connection.db('node-react');
            let users = await db.collection("crm").find({}).toArray();
            await connection.close()
            res.json(users);
        } catch (error) {
            console.log('userlist error')
        }
    
})


//for login
app.post('/login', async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let user = await db.collection('crm').findOne({ email: req.body.email });
        if (user) {
            let passwordResult = await bcrypt.compare(req.body.password, user.password);
            if (passwordResult) {
                let token = jwt.sign({ userid: user._id }, secret, { expiresIn: '1h' })
                res.json({ token })
            }
            else {
                res.status.apply(401).json({ message: "Email id or password donot match" })
            }
        } else {
            res.status(401).json({ message: "Email id or password donot match" });
        }
    } catch (error) {
        console.log('error')
    }
})

//to edit particular user
app.get('/user/:id',async function(req,res){
    try {
     
   let connection = await mongoClient.connect(URL);
   let db = connection.db('node-react');
   let objId = mongodb.ObjectId(req.params.id)
   let user = await db.collection("crm").findOne({_id:objId});
   await connection.close()
   if (user) {
       res.json(user);
   } 
   else {
       res.status.json({message:"usernotfound"})
   }
    } catch (error) {
       res.status(500).json({message: "something went wrong"})
    }
})
//UPDATE
app.put('/users/:id',async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let objId = mongodb.ObjectId(req.params.id);
        
        let user =  await db.collection('crm').findOneAndUpdate({_id:objId},{$set:req.body});
        res.json({message: 'user updated'})
    } catch (error) {
     console.log('user update error')   
    }
})

//reset password
app.post('/reset', async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let user = await db.collection('crm').findOne({ email: req.body.email });
        if (user) {
            let passwordResult = await bcrypt.compare(req.body.password, user.password);
            if (passwordResult) {
                let token = jwt.sign({ userid: user._id }, secret, { expiresIn: '1h' })
                res.json({ token })
            }
            else {
                res.status.apply(401).json({ message: "Email id or password donot match" })
            }
        } else {
            res.status(401).json({ message: "Email id or password donot match" });
        }
    } catch (error) {
        console.log('error')
    }
})




//forgot password
app.get('/maillist',async function (req,res){

    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let user = await db.collection("crm").find({email:req.body.email});
        console.log(user);
        if(user){
                    var sender = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: 'ramkimarichamy9@gmail.com',
                        pass: 'Vallalar5!'
                    }
                });

            var composemail = {
                from: "ramkimarichamy9@gmail.com",
                to: req.body.email,
                subject: 'send mail using node js',
                text: "hello using this link",
                html: ''

            };
        }
            sender.sendMail(composemail,function(err,info){
            if(info){
                console.log('mail sent successfully')
            }
            })
            await connection.close()
            res.json(user);
            
        }
        catch(err){
            console.log('error in mailcreation')
        }
       

})

//to delete user
app.delete('/user/:id',async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("crm").deleteOne({_id:objId})
        await connection.close();
        res.json({message: "user deleted"});
    } catch (error) {
        console.log('error')
    }
})

//add company contact
app.post('/contact',async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        await db.collection('contact').insertOne(req.body);
        connection.close();
        res.json({ message: "contact created" })
    } catch (error) {
        console.log('contact error')
    }

    
})
app.get('/contact',async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let users = await db.collection("contact").find({}).toArray();
        await connection.close()
        res.json(users);
    } catch (error) {
        console.log('contactlist error')
    }
})

//service request
app.post('/service',async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        await db.collection('service').insertOne(req.body);
        connection.close();
        res.json({ message: "service requested" })
    } catch (error) {
        console.log('service request error')
    }

    
})

//view service request
app.get('/service',async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db('node-react');
        let users = await db.collection("service").find({}).toArray();
        await connection.close()
        res.json(users);
    } catch (error) {
        console.log('servicelist error')
    }
})




app.listen(3001);