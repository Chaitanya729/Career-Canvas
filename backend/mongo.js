const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/project")
.then(()=>
{
    console.log("Mongodb connected")
})
.catch(()=>
{
    console.log('Mongo failed')
})

const newSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    name:
    {
        type:String,
        required:true
    },
    age:
    {
        type:Number,
        required:true
    }
})

const commentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    commentedby: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

const postSchema = new mongoose.Schema({
    email: String,
    description: String,
    profile: String,
    type: String,
    pdfFile: Buffer,
    comments: [commentSchema]
})

const collection = mongoose.model("collection", newSchema)
const posts = mongoose.model("posts", postSchema)

module.exports = { collection, posts }