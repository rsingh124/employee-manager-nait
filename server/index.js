require('dotenv').config()
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const {v4: uuid} = require('uuid');
const {check, validationResult} = require('express-validator');
const path = require('path');
const PORT = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({urlencoded: false}));
app.use(session({
    secret: "demoappsecret",
    saveUninitialized: false,
    resave: false
}))
app.use(cors())

app.use(express.static(path.join(__dirname, '../client/js')));

const AuthMiddleware = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else res.redirect('/login')
}

const alreadyAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}


// STATIC MIDDLE WARE
// req---> url http://localhost:3000/endpoint
// endpoint (.ext ignored  index.html !== index)
const options = {
    dotfiles: 'ignore',
    extensions: ['htm', 'html']
}
// app.use(express.static(path.join(__dirname, '../client'), options))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
})

app.get('/register', alreadyAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/signup.html'))
})

app.get('/login', alreadyAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/login.html'))
})

app.get('/dashboard', AuthMiddleware, (req, res) => {
    res.render(path.join(__dirname, '../client/dashboard.ejs'))
})

app.post('/login', [
    check('email', 'a valid email is required')
        .isEmail()
        .normalizeEmail(),
    check('password', 'password is required')
        .notEmpty()
], (req, res) => {
    if (!validationResult(req).isEmpty()) {
        res.redirect('/login');
    } else {
        const {
            email,
            password
        } = req.body;

        fs.readFile('./data/users.json', 'utf8', async function (err, data) {
            if (err) {
                console.log(err)
            } else {
                const file = JSON.parse(data);
                try {
                    await new Promise((resolve, reject) => {
                        let count = 0;
                        file.forEach(element => {
                            if (element.email == email && element.password == password) {
                                req.session.isLoggedIn = true;
                                res.redirect('/dashboard');
                                resolve();
                            } else {
                                count++;
                                if (count === file.length) {
                                    reject('not found');
                                }
                            }
                        });
                    })
                } catch (error) {
                    res.redirect('/login')
                }
            }
        });

    }
})

app.post('/register', [
    check('username', 'Username is required')
        .notEmpty(),
    check('email', 'a valid email is required')
        .isEmail()
        .normalizeEmail(),
    check('password', 'password is required')
        .notEmpty()
], (req, res) => {
    if (!validationResult(req).isEmpty()) {
        res.redirect('/register');
    } else {
        const {
            username,
            email,
            password
        } = req.body;

        fs.readFile('./data/users.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err)
            } else {
                const file = JSON.parse(data);

                file.push({
                    id: uuid(),
                    username,
                    email,
                    password
                })

                const json = JSON.stringify(file);

                fs.writeFile('./data/users.json', json, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/login');
                    }
                });
            }

        });

    }
})

//MIDDLE WARE TRIES TO MATCH THE ENDPOINT
app.get('/api/v1/employees', (req, res) => {
    fs.readFile('./data/employees.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        } else {
            const file = JSON.parse(data);
            res.json(file);
        }
    });
})

//delete a user
app.get('/delete/:id', (req, res) => {
    let bufferArray = [];
    fs.readFile('./data/employees.json', 'utf8', function (err, data) {
        if (err) {
            res.json(err);
        } else {
            let file = JSON.parse(data);
            bufferArray = file;
            bufferArray.forEach(async (ob, idx) => {
                if(ob.id === req.params.id){
                    delete bufferArray[idx];
                    file = bufferArray;
                    let filteredArray = [];
                    await new Promise((resolve, reject) => {
                        let count = file.length - 1;
                        filteredArray = file.filter(e => {
                            console.log(count);
                            count--;
                            return e !== null
                        })
                        if(count === 0) {
                            resolve();
                        }
                    })
                    fs.writeFile('./data/employees.json', JSON.stringify(filteredArray), 'utf-8', function(err, data) {
                        if (err) res.json(err);
                        res.redirect('/dashboard')
                    })
                } else {
                }
            })
        }
    });
})

//MIDDLE WARE 404 as the last MIDDLEWARE 
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../client/404.html'))
})

// server listenting on port
// .env specifies what port to listen on :3000
// if you enter a different port in then use it when
// making your api requests.
// connection url to the server http://localhost:3000
app.listen(PORT, () => {
    console.log(`Your Server Is Running On---------> http://localhost:${PORT}`)
})
