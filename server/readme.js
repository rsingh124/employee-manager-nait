const fs = require('fs')

fs.readFile('./data/employees.json', 'utf8', (err, data)=>{
    console.log(data)

    if(err){
        console.log("deal with the error")
    }
})