const express=require('express');
const app=express();
app.use(express.json());
const connectToDatabase=require('./db'); 
const userRoute = require('./routes/userRoute');
const bookRoute = require('./routes/booksRoute');
const notificationRoute= require('./routes/notificationRoute');
const { startConsumer } = require('./consumer/bookEventConsumer');
const {startUserOrderConsumer}=require('./consumer/prevOrderEventConsumer')
const {startBrowsingEventConsumer}=require('./consumer/browsingHistoryEventConsumer');
connectToDatabase();



app.use('/users', userRoute);
app.use('/books', bookRoute);
app.use('/notify',notificationRoute);


startConsumer();
startUserOrderConsumer();
startBrowsingEventConsumer();

app.listen(3030,()=>{
    console.log('Server is running on http://localhost:3030')
}); 