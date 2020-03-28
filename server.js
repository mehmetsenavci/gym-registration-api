const app = require('./app.js');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        dbName: 'boxing-gym',
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to database successfully!');
    });

const PORT = 3000 || process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
