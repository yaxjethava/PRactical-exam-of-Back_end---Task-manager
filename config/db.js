const mongoose = require("mongoose");
require("dotenv").config()

// Replace with your own connection string from MongoDB Atlas
const uri = process.env.MONGOODB_ATLAS_URL;

// Connect to MongoDB Atlas

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('error', (err) => {
    console.log("❌ Database connection error:", err.message);
})
db.once("open", () => {
    console.log("✅ MongoDB Atlas connected successfully!");
});

module.exports = db;
