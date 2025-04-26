const express=require('express');
const app=express();
const connectToDatabase=require('./db'); 

connectToDatabase();


app.listen(3030,()=>{
    console.log('Server is running on http://localhost:3030')
}); 