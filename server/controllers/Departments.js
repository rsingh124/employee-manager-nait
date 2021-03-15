// Class
// Bluepring for an object  imperative programming
// vars class propertis, funciton class methods


const fileService = require('../services/fileService')
class Department {
 
     constructor(filePath){
       this.dataFile = filePath
       console.log("new document object created")
     }

     getDepartments(){
         const employees = this.getData()
         return [... new Set(employees.map(employee => employee.department))]
     }

     getDeparmentByName(){

        return null

     }

     getData(){
        return fileService.getFileContents(this.dataFile)
     }

}

module.exports = Department

 
 

 



