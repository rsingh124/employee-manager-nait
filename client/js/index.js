/* 
         APP CHOICES
         vanilla js  works in the browser

         es modules they work in the browser but using advanced or new js features you need a bundler
         async await (.then()) are not supported in es mods TC-39
         node_modules using npm feagtures you want to use.
         bundler  makes new js accessible to browser
         new js accessible to old browser.
         parcel no config bunlder

         functions as class

         NODE.js ----> Commonjs npm


*/

window.addEventListener('load', async function (e) {
    const table = document.getElementById("table");
    // API URL   http://localhost:3000......    endpoint  path to a file or folder
    // API END POINT
    // CALL TO THE API---> api/v1/employees
    const url = "http://localhost:3000/api/v1/employees"
    const req = await fetch(url);
    const result = await req.json();
    console.log(result)
    result.forEach(element => {
        table.innerHTML += `<tr>
            <th contenteditable="true">${element.firstName}</th>
            <th contenteditable="true">${element.lastName}</th>
            <th contenteditable="true">${element.email}</th>
            <th contenteditable="true">${element.officeNumber}</th>
            <th contenteditable="true">${element.cellNumber}</th>
            <th contenteditable="true">${element.position}</th>
            <th contenteditable="true">${element.department}</th>
            <th contenteditable="true">${element.salary}</th>
            <th>
            <a href="/delete/${element.id}">Delete</a>
            </th>
        </tr>`
    })
})

const saveData = async (e) => {
    let table = document.getElementById("table");
    //gets rows of table
    let rowLength = table.rows.length;

    //loops through rows    
    for (i = 1; i < rowLength; i++) {

        //gets cells of current row  
        let oCells = table.rows.item(i).cells;

        //gets amount of cells of current row
        let cellLength = oCells.length;

        //loops through each cell in current row
        for (let j = 0; j < cellLength - 1; j++) {
            let cellVal = oCells.item(j).innerHTML;
            console.log(cellVal)
        }
    }
}
