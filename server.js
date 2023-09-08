const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const app = express();

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);


// app.get('/', (req,res) => {
//     res.send('Hello World');
// })


mongoose.connect('mongodb+srv://akhilavijayan964:akhila123@cluster0.arxc2uf.mongodb.net/Node_API?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log("Node API running on port 3000");
    });
}).catch((err) => {
    console.log(err);
})