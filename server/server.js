import Express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import routes from './routes';
import serverConfig from './config';

// Initialize the Express App
const app = new Express();


// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
    if (error) {
        console.error('Please make sure Mongodb is installed and running!');
        throw error;
    }
});

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: false}));
+app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/api', routes);

// start app
app.listen(serverConfig.port, (error) => {
    if (!error) {
        console.log(`SkiApp is running on port: ${serverConfig.port}!`);
    }
});

export default app;
