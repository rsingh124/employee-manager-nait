// CommonJS Module
const express = require('express')

// Router Handles All HTTP Verbs get, post  put del  CRUD
const router = express.Router()


// Routing Middleware for the api/deparments endpoints
module.exports = ()=>{

    router.get('/', (req, res)=>{
        res.send("GET ALL EMPLOYEES")
    })

    
         

    return router
}
