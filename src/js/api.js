"use strict";
//ladda DOM
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
})

//hämta JSON-data vattenfontäner
async function fetchData() {
    try {
        const response = await fetch("https://apigw.stockholm.se/api/PublicHittaCMS/api/serviceunits?&filter[servicetype.id]=104&page[limit]=1500&page[offset]=0&sort=name");
        const data = await response.json();

        writeData(data.data);

    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

function writeData(data) {
    const resultBeachEl = document.querySelector("#result-beach");
    resultBeachEl.innerHTML = "";

    console.log(data);

    data.forEach(d => {

        const articleEl = document.createElement("article");
        const h3El = document.createElement("h3");
        const h4El = document.createElement("h4");

        //lägg till text
        h3El.innerHTML = d.attributes.name.toUpperCase();
        h4El.innerHTML = d.attributes.address.street.toUpperCase();

        //lägg till i article
        articleEl.appendChild(h3El);
        articleEl.appendChild(h4El);

        //skriv ut till DOM
        resultBeachEl.appendChild(articleEl);
    })

}