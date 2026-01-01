const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    //mongodb+srv://santhosh:<db_password>@cluster0.xdpma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    //mongodb://localhost:27017/
    await mongoose.connect('mongodb+srv://santhosh:Admin100@cluster0.xdpma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
   // await mongoose.connect('mongodb://localhost:27017/', {
   // await mongoose.connect('http://mongodb.sandynx.shop/', {
    //  useNewUrlParser: true,
    //  useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;