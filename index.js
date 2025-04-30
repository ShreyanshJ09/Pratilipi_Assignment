const express=require('express');
const app=express();
app.use(express.json());
const connectToDatabase=require('./db'); 
const userRoute = require('./routes/userRoute');
const bookRoute = require('./routes/booksRoute');
const notificationRoute= require('./routes/notificationRoute');
const { startConsumer } = require('./consumer/bookEventConsumer');
const {startUserOrderConsumer}=require('./consumer/prevOrderEventConsumer')
connectToDatabase();



app.use('/users', userRoute);
app.use('/books', bookRoute);
app.use('/notify',notificationRoute);


startConsumer()
  .then(() => console.log('Book event consumer started'))
  .catch(err => console.error('Failed to start book event consumer:', err));

startUserOrderConsumer()
  .then(() => console.log('Previous order event consumer started'))
  .catch(err => console.error('Failed to start previous order event consumer:', err));

app.listen(3030,()=>{
    console.log('Server is running on http://localhost:3030')
}); 