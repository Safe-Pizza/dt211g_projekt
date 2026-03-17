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

async function fetchLocationData(street) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${street}&format=jsonv2`);
        const data = await res.json();

        return data;

    } catch (error) {
        document.querySelector("#map").innerHTML = "Platsen finns ej";
    }
}

async function fetchWeather(la, lo) {

    try {
        const res = await fetch(`https://my.meteoblue.com/packages/basic-day?&lat=${la}&lon=${lo}&forecast_days=5&format=json&apikey=2VzdlcIwe8H0MQrh`);
        const data = await res.json();

        writeWeather(data);

    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

function writeData(data) {
    const resultBeachEl = document.querySelector("#result-beach");
    resultBeachEl.innerHTML = "";

    data.forEach(d => {

        const articleEl = document.createElement("article");
        const h2El = document.createElement("h2");
        const spanEl = document.createElement("span");

        articleEl.classList.add("link");
        articleEl.classList.add("animation-scale");

        //lägg till text
        h2El.innerHTML = d.attributes.name.toUpperCase();
        spanEl.innerHTML = d.attributes.address.street.toUpperCase() + ', ' + d.attributes.address.city.toUpperCase() + '<span class="fa-solid fa-location-dot"</span>';

        //lägg till i article
        articleEl.appendChild(h2El);
        articleEl.appendChild(spanEl);

        //skriv ut till DOM
        resultBeachEl.appendChild(articleEl);

        //eventlyssnare för klick(
        articleEl.addEventListener("click", async () => {
            writeUniqueData(d.links.self);
            showMap(d.attributes.address.street);
        })
    })

}

async function writeUniqueData(uniqueBeachData) {
    const beachData = await fetchUniqueData(uniqueBeachData);

    //scrolla högst upp
    window.scrollTo(0, 0);

    //ta bort start innehåll
    document.querySelector("#start-content").innerHTML = "";

    //göm sökfält
    document.querySelector("#search").style.display = "none";

    const resultBeachEl = document.querySelector("#result-beach");
    resultBeachEl.innerHTML = "";

    //skapa html element
    const articleEl = document.createElement("article");
    const h2El = document.createElement("h2");
    const spanEl = document.createElement("span");
    const pEl = document.createElement("p");
    const divEl = document.createElement("div");

    //lägg till text
    h2El.innerHTML = beachData.attributes.name.toUpperCase();
    spanEl.innerHTML = beachData.attributes.address.street.toUpperCase() + ', ' + beachData.attributes.address.city.toUpperCase() + '<span class="fa-solid fa-location-dot"</span>';
    pEl.innerHTML = beachData.attributes.shortDescription;
    divEl.innerHTML = beachData.attributes.contentSections["17"].content;

    //lägg till i article
    articleEl.appendChild(h2El);
    articleEl.appendChild(spanEl);
    articleEl.appendChild(pEl);
    articleEl.appendChild(divEl);

    //skriv ut till DOM
    resultBeachEl.appendChild(articleEl);
}

async function showMap(address) {
    const addressArr = await fetchLocationData(address);
    const mapEl = document.querySelector("#map");

    //latitud och longitud från första objektet i sökning
    const lat = addressArr[0].lat;
    const lon = addressArr[0].lon;

    //skicka koordinater till väderAPI
    fetchWeather(lat, lon);

    //variabel för kart-url
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon},${lat},${lon},${lat}&amp;layer=mapnik&amp;marker=${lat},${lon}`;

    //skriva ut karta till DOM
    mapEl.innerHTML = `<iframe class="responsive-iframe" width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${mapUrl}"></iframe>`
}

function writeWeather(weatherData) {
    let day1El = document.querySelector("#day1");
    let day2El = document.querySelector("#day2");
    let day3El = document.querySelector("#day3");
    let day4El = document.querySelector("#day4");
    let day5El = document.querySelector("#day5");

    day1El.innerHTML = `<span class="time">${weatherData.data_day.time[0]}</span><br><span class="temp">${weatherData.data_day.temperature_mean[0]}°C</span><br><img src=/${weatherData.data_day.pictocode[0]}.svg alt="">`;
    day2El.innerHTML = `<span class="time">${weatherData.data_day.time[1]}</span><br><span class="temp">${weatherData.data_day.temperature_mean[1]}°C</span><br><img src=/${weatherData.data_day.pictocode[1]}.svg alt="">`;
    day3El.innerHTML = `<span class="time">${weatherData.data_day.time[2]}</span><br><span class="temp">${weatherData.data_day.temperature_mean[2]}°C</span><br><img src=/${weatherData.data_day.pictocode[2]}.svg alt="">`;
    day4El.innerHTML = `<span class="time">${weatherData.data_day.time[3]}</span><br><span class="temp">${weatherData.data_day.temperature_mean[3]}°C</span><br><img src=/${weatherData.data_day.pictocode[3]}.svg alt="">`;
    day5El.innerHTML = `<span class="time">${weatherData.data_day.time[4]}</span><br><span class="temp">${weatherData.data_day.temperature_mean[4]}°C</span><br><img src=/${weatherData.data_day.pictocode[4]}.svg alt="">`;
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