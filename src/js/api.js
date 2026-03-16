"use strict";
let allData = [];

//ladda DOM
document.addEventListener("DOMContentLoaded", () => {
    fetchData();

    //händelselyssnare för sökfunktion
    document.querySelector("#search").addEventListener("input", () => {
        searchFilter(allData);
    });
})

//hämta JSON-data badplatser
async function fetchData() {
    try {
        const response = await fetch("https://apigw.stockholm.se/api/PublicHittaCMS/api/serviceunits?&filter[servicetype.id]=104&page[limit]=1500&page[offset]=0&sort=name");
        const data = await response.json();

        allData = data.data;
        writeData(data.data);

    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

async function fetchUniqueData(uniqueData) {
    try {
        const response = await fetch(uniqueData);
        const data = await response.json();

        return data.data;

    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

function writeData(data) {
    const resultBeachEl = document.querySelector("#result-beach");
    resultBeachEl.innerHTML = "";

    data.forEach(d => {

        const articleEl = document.createElement("article");
        const h3El = document.createElement("h3");
        const h4El = document.createElement("h4");

        //lägg till text
        h3El.innerHTML = d.attributes.name.toUpperCase();
        h4El.innerHTML = d.attributes.address.street.toUpperCase() + ', ' + d.attributes.address.city.toUpperCase() + '<span class="fa-solid fa-location-dot"</span>';

        //lägg till i article
        articleEl.appendChild(h3El);
        articleEl.appendChild(h4El);

        //skriv ut till DOM
        resultBeachEl.appendChild(articleEl);

        //eventlyssnare för klick(
        articleEl.addEventListener("click", async () => {
            writeUniqueData(d.links.self)
        })
    })

}

async function writeUniqueData(uniqueBeachData) {
    const beachData = await fetchUniqueData(uniqueBeachData);

    const resultBeachEl = document.querySelector("#result-beach");
    resultBeachEl.innerHTML = "";

        const articleEl = document.createElement("article");
        const h3El = document.createElement("h3");
        const h4El = document.createElement("h4");
        const pEl = document.createElement("p");

        //lägg till text
        h3El.innerHTML = beachData.attributes.name.toUpperCase();
        h4El.innerHTML = beachData.attributes.address.street.toUpperCase() + ', ' + beachData.attributes.address.city.toUpperCase() + '<span class="fa-solid fa-location-dot"</span>';
        pEl.innerHTML = beachData.attributes.shortDescription;

        //lägg till i article
        articleEl.appendChild(h3El);
        articleEl.appendChild(h4El);
        articleEl.appendChild(pEl);

        //skriv ut till DOM
        resultBeachEl.appendChild(articleEl);
}

function searchFilter(dataArr) {
    let input = document.querySelector("#search").value.toLowerCase();

    let dataArrFilt = dataArr.filter((data) =>
        data.attributes.name.toLowerCase().includes(input) ||
        data.attributes.address.street.toLowerCase().includes(input) ||
        data.attributes.address.city.toLowerCase().includes(input)
    );

    writeData(dataArrFilt);
}