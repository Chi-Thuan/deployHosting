const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const app = express()
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "872166117516-can8vmlj3pghnai83u0s6ia12hq5935v.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

app.use(cookieParser())
app.use(express.static(path.join(__dirname, './views')))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

app.set('view engine', 'ejs');

app.get('/login', function(req, res, next) {
    res.render('index')
})

app.get('/thanhcong', function(req, res, next) {
    res.render('thanhCong')
})

app.get('/profile', checkAuthen, function(req, res, next) {
    let user = req.user
    res.render('profile', { user } )
})

app.get('/logout', function(req, res, next) {
    res.clearCookie('session-token')
    res.redirect('/login')
})

function checkAuthen (req, res, next) {
    let token = req.cookies['session-token']
    let user = {}

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        user = payload
      }
    
      verify()
    .then(() => {
        req.user = user
        next()
    })
      .catch(
          err => {
            res.redirect('/login')
          }
      );

}

app.post('/login', function(req, res, next) {
    let token = req.body.token

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
      }
    
      verify()
    .then(() => {
        res.cookie('session-token', token)
        res.send('success')
    })
      .catch(console.error);
})

app.listen('5000', function() {
    console.log('Start server thanh cong !!!')
})