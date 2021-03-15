// CommonJS Module
const express = require('express')
const Department = require('../controllers/Departments')
// Router Handles All HTTP Verbs get, post  put del  CRUD
const router = express.Router()

const department = new Department('../data/employees.json')
// Routing Middleware for the api/deparments endpoints
module.exports = ()=>{

    router.get('/', (req, res)=>{
        // return a list of all the departments
        res.send( department.getDepartments())
    })

    router.get('/name', (req, res)=>{
        // return all the employees in a department
        res.send("GET A SINGLE DEPARTMENT")
    })
         

    return router
}
