require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT || 3000;
const cors = require("cors");
const corsOptions = require("./config/corsOptions");


const app = express();
app.use(express.json({
    limit: "1mb"
}))
app.use(cors(corsOptions));


app.get("/", (req,res)=>{
    res.status(200).json({message:"hi"})
})

app.use("/api/search", require("./routes/searchStoreRoute"))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});