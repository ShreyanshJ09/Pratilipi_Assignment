const express=require('express');
const app=express();
app.use(express.json());
const connectToDatabase=require('./db'); 
const userRoute = require('./routes/userRoute');
const bookRoute = require('./routes/booksRoute');

connectToDatabase();



app.use('/users', userRoute);
app.use('/books', bookRoute);


app.listen(3030,()=>{
    console.log('Server is running on http://localhost:3030')
}); 