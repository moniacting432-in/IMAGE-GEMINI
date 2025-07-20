const express = require('express')
const cors = require('cors'); // <-- ADDED
const app = express();
app.use(cors()); 
const port = 3000
const multer = require("multer");

const {GoogleAIFileManager}=require("@google/generative-ai/server");
const {GoogleGenerativeAI}=require("@google/generative-ai");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,"./uploads")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post("/upload",upload.single("file"),async(req,res) => {

    console.log(req.file);
    const fileManager= new GoogleAIFileManager(
        "AIzaSyCxilOGJO6PbYHC1iz-HgcqXM-HTl3Ommw");
    const uploadedResult=await fileManager.uploadFile(`./uploads/`+req.file.filename,{
            mimeType:req.file.mimetype,
            displayName:req.file.originalname,
        });

//View the response
console.log(
    `Uploaded file ${uploadedResult.file.displayName} as: ${uploadedResult.file.uri}`,

);
    const genAI=new GoogleGenerativeAI("AIzaSyCxilOGJO6PbYHC1iz-HgcqXM-HTl3Ommw");
    const model=genAI.getGenerativeModel({model:"gemini-2.0-flash"})
    const result= await model.generateContent([
   "Tell me about the image.",
   {
    fileData:{
        fileUri:uploadedResult.file.uri,
        mimeType:uploadedResult.file.mimeType,
    },
   } ,
    
]);

    console.log(result.response.text());
   res.json({ msg: result.response.text() });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
