const mongoose = require('mongoose');
const config = require('dotenv');
const { Server } = require('mongodb');
config.config({
    path:'./config.env'
});

process.on('uncaughtException', err=>{
    console.log('UNCAUGHT EXECPTION !!! shutting dow...');
    console.log(err.name, err.message);
    process.exit(1);
});
const app = require('./app');
const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log('DB da duoc connect noi!!');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION !!! shutting dow...');
    console.log(err.name, err.message);
    Server.close(()=>{
        process.exit(1);
    });
});