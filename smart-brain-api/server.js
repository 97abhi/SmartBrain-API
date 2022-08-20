const { response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

const saltRounds = 10;

const database = {
    users: [
        {
            id:"123",
            name :'John',
            email : 'john@gmail.com',
            password: 'cookies',
            entries : 0,
            joined : new Date()
        },
        {
            id:"124",
            name :'Sally',
            email : 'Sally@gmail.com',
            password: 'bananas',
            entries : 0,
            joined : new Date()
        }
    ]
}

app.use(cors())
app.use(express.json());


app.get('/',(req,res)=>{
    res.send(database.users);
})

app.post('/SignIn', (req,res)=>{
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    }
    else{
        res.status(400).json("error logging in")
    }

    
// // Load hash from your password DB.
// bcrypt.compare(database.password, hash, function(err, result) {
//     // result == true
// });
})


app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });


    
    database.users.push({
        id:"125",
        name :name,
        email : email,
        password: password,
        entries : 0,
        joined : new Date()
    })
    res.json(database.users[database.users.length-1]);
})


app.get('/profile/:id', (req,res)=>{
    const {id }= req.params;
    database.users.forEach(user =>{
        if(user.id === id){
            res.json(user)
        }
        // else{
        //     res.status(404).json("No such user");
        // }
    })
})

app.put('/image', (req,res)=>{
    const {id }= req.body;
    database.users.forEach(user =>{
        if(user.id === id){
            user.entries++
            res.json(user.entries);
        }
})
})

app.listen(3001, ()=>{
    console.log("App is running on port 3000")
})


