const express = require('express'),
    Session = require('express-session'),
    bodyParse = require('body-parser'),
    mongoose = require('mongoose'),
    middleware = require('connect-ensure-login'),
    FileStore = require('session-file-store')(Session),
    config = require('./config/default'),
    flash = require('connect-flash'),
    port = 3333,
    app = express();
    cors = require('cors')

const node_media_server = require('./media_server');

mongoose.connect('mongodb://127.0.0.1/nodeStream', { useNewUrlParser: true });

//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
app.use(flash());
app.use(require('cookie-parser')());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json({ extended: true }));
app.use(cors())

app.use(Session({
    store: new FileStore({
        path: './server/sessions'
    }),
    secret: config.server.secret,
    maxAge: Date().now + (60 * 1000 * 30)
}));

/* app.get('*', middleware.ensureLoggedIn(),cors(), (req, res) => {
    res.render('index');
}); */

app.get('/stream',cors(), (req, res) => {
     if(req.query.streams){
        let streams = JSON.parse(req.query.streams);
        let query = {$or: []};
        for (let stream in streams) {
            if (!streams.hasOwnProperty(stream)) continue;
            query.$or.push({stream_key : stream});
        }
        console.log(streams)
        /* User.find(query,(err, users) => {
            if (err)
                return;
            if (users) {
                res.json(users);
            }
        });  */
    }
    res.json({streams:'req.query.streams'})
})

app.listen(port, () => console.log(`App listening on ${port}!`));
node_media_server.run();