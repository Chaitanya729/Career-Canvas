const express = require("express")
const nodemailer = require("nodemailer")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()
const session = require("express-session")
const passport = require("passport")
const cookieSession = require("cookie-session")
const multer = require('multer')
const { collection, posts }  = require("./mongo")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const bcrypt = require('bcrypt')
const saltRounds = 10;

const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

// const transporter = nodemailer.createTransport
// ({
//     service:'gmail',
//     auth: {
//         user: 'rockstarman957@gmail.com',
//         pass: 'secret1234'
//     }
// });

app.use(session({
    resave:false,
    saveUninitialized:true,
    secret: process.env.SESSION_SECRET,
    cookie: { secure: true }
}))

app.set('view engine', 'ejs')



app.get('/', cors(), (req, res) => {

})

app.post("/", async (req, res) => {

    const { email, password } = req.body

    try {
        const check = await collection.findOne({ email: email })
        if (check) {
            const match = await bcrypt.compare(password, check.password);
            if(match)
                {
                    res.json("Exists")
                }
            else res.json("Password Incorrect")
        }
        else {
            res.json("Does not exist")
        }
    }

    catch (e) {
        res.json("Not valid")
        console.log(e);
    }

})

app.post("/signup", async (req, res) => {

    const { email, password, name, age } = req.body

    try {
        const check = await collection.findOne({ email: email })
        if (check) {
            res.json("Already Exists")
        }
        else {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const data = {
                email:email,
                password: hashedPassword,
                name: name,
                age: age
            }
            await collection.insertMany([data])
            res.json("Succesful")
        }
    }

    catch (e) {
        console.log(e)
        res.json("Invalid")
    }

})

app.post("/apply", upload.single('pdfFile'), async (req,res) =>{

    try{
        const {email, description, profile, type} = req.body;
        const pdfFile = req.file.buffer;

        const data = {
            email: email,
            description: description,
            profile: profile,
            type: type,
            pdfFile: pdfFile,
            comments: []
        };

        await posts.insertMany([data]);

        res.send("Successful")
    } catch (error)
    {
        console.error(error);
        req.statusCode(500).send("Error")
    }

});

app.get("/review", async (req, res) => {
    try {
        let applications = await posts.find();
        // Convert each pdfFile from buffer to base64 string
        applications = applications.map(application => {
            if (application.pdfFile && Buffer.isBuffer(application.pdfFile)) {
                return {
                    ...application.toObject(), // Convert mongoose document to a plain JavaScript object
                    pdfFile: application.pdfFile.toString('base64')
                };
            }
            return application;
        });
        res.json(applications);
    } catch (e) {
        console.log(e);
        res.status(500).json("Error");
    }
});

app.post("/review/:id", async (req, res) => {

    const { id } = req.params;
    const { text, commentedby} = req.body;
    console.log(id, text, commentedby);

    try {
        const post = await posts.findById(id);

        if(!post) return res.status(404).json("Post not found");

        const newComment = {
            text: text,
            commentedby: commentedby,
            createdAt: new Date()
        };

        post.comments.push(newComment);

        await post.save();

        res.json({message: "Comment Posted !!!"});
    } catch(error)
    {
        console.error(error);
        res.status(500).json("Error !!!");
    }

});

app.get("/review/search/:searchTerm", async (req, res) => {
    const { searchTerm } = req.params;
    try {
        // Create a regex pattern to search case-insensitively
        const searchPattern = new RegExp(searchTerm, 'i');
        let applications = await posts.find({
            $or: [
                { email: { $regex: searchPattern } },
                { name: { $regex: searchPattern } },
                { type: { $regex: searchPattern } },
                { profile: { $regex: searchPattern } }
            ]
        });
        // Convert each pdfFile from buffer to base64 string
        applications = applications.map(application => {
            if (application.pdfFile && Buffer.isBuffer(application.pdfFile)) {
                return {
                    ...application.toObject(), // Convert mongoose document to a plain JavaScript object
                    pdfFile: application.pdfFile.toString('base64')
                };
            }
            return application;
        });
        res.json(applications);
    } catch (e) {
        console.log(e);
        res.status(500).json("Error");
    }
});

// Needs work !!!!
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);


    const mailOptions = {
        from: 'rockstarman957@gmail.com',
        to: email,
        subject: 'OTP for Career Canvas Sign Up',
        text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error sending email" });
        } else {
            console.log('Email sent: ' + info.response);
            // Sending the OTP back for now, to test the application
            res.json({ success: true, otp }); 
            
        }
    });
});

app.listen(5000, ()=>
{
    console.log("Port Connected")
})