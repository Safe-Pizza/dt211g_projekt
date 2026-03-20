"use strict";
let allData = [];

/**
 * Händelselyssnare för DOM färdigladdat
 * Anropar sedan fetchData för att hämta innehåll
 * 
 * @event DOMContentLoaded
 * @returns {void} - returnerar inget värde utan anropar funktion när DOM laddat klart
 */
document.addEventListener("DOMContentLoaded", () => {
    fetchData();

    /**
     * Händelselyssnare för inputfält
     * Vid input anropas funktion searchFilter
     * 
     * @param {array} allData - array med data sparad vid API-hämtning
     * @returns {void} - returnerar inget värde, anropar funktion vid input
     */
    document.querySelector("#search").addEventListener("input", () => {
        searchFilter(allData);
    });

    document.querySelector("#startsida").addEventListener("click", () => {
        writeData(allData);
    })
})

/**
 * Hämtar Stockholms Stads badplatser från API
 * Data skickas vidare till writeData, data lagras i variabel
 * 
 * @property {array} allData - array med data från API
 * @returns {void} - returnerar inget värde, anropar funktion
 * @throws {error} - skriver ut fel i konsol om hämtning misslyckas
 */
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

/**
 * Hämtar unik badplats från Stockholms Stads API
 * 
 * @param {url} uniqueData - URL för unik badplats
 * @returns {object} - returnerar objekt för specifik badplats
 * @throws {error} - skriver ut fel i konsol om hämtning misslyckas
 */
async function fetchUniqueData(uniqueData) {
    try {
        const response = await fetch(uniqueData);
        const data = await response.json();

        return data.data;

    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

/**
 * Hämtar geo-info om specifik gatuadress från API
 * 
 * @param {string} street - textsträng med badplats gatuadress
 * @returns {array} - returerar array med positionsdata för gatuadress
 * @throws {error} - skriver ut felmeddelande i DOM om hämtning misslyckas
 */
async function fetchLocationData(street) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${street}&format=jsonv2`);
        const data = await res.json();

        return data;

    } catch (error) {
        document.querySelector("#map").innerHTML = "Platsen finns ej";
    }
}

/**
 * Hämtar väder-info för specifik plats från API
 * 
 * @param {string} la - textsträng med latitud
 * @param {string} lo - textsträng med longitud
 * @returns {void} - returnerar inget värde, anropar funktion
 * @throws {error} - skriver ut fel i konsol om hämtning misslyckas
 */
async function fetchWeather(la, lo) {

    try {
        const res = await fetch(`https://my.meteoblue.com/packages/basic-day?&lat=${la}&lon=${lo}&forecast_days=5&format=json&apikey=2VzdlcIwe8H0MQrh`);
        const data = await res.json();

        writeWeather(data);

    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

/**
 * Skapar DOM-element med innehåll från API
 * och skriver ut till DOM
 * 
 * @param {array} data - array med badplatser från Stockholm Stads API
 * @returns {void} - returnerar inget värde
 */
function writeData(data) {
    const resultBeachEl = document.querySelector("#result-beach");
    document.querySelector("#weather").style.visibility = "hidden";
    document.querySelector("#start-content").style.display = "block";
    document.querySelector("#search").style.display = "block";
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

        /**
         * Händelselyssnare för klick på article-element
         * Anropar funktioner writeUniqueData och ShowMap
         * 
         * @event click
         * @returns {void} - returerar inget värde, anropar funktioner
         * 
         */
        articleEl.addEventListener("click", async () => {
            writeUniqueData(d.links.self);
            showMap(d.attributes.address.street);
        })
    })

}

/**
 * Skapar DOM-element för unik badplats från API
 * och skriver ut till DOM
 * 
 * @param {object} uniqueBeachData - object för specifik badplats från API
 * @returns {void} - returerar inget värde
 */
async function writeUniqueData(uniqueBeachData) {
    const beachData = await fetchUniqueData(uniqueBeachData);
    document.querySelector("#weather").style.visibility = "visible";

    //scrolla högst upp
    window.scrollTo(0, 0);

    //göm start innehåll
    document.querySelector("#start-content").style.display = "none";

    //göm sökfält
    document.querySelector("#search").style.display = "none";

    const resultBeachEl = document.querySelector("#result-beach");
    resultBeachEl.innerHTML = "";

    //skapa html element
    const articleEl = document.createElement("article");
    const divButtonEl = document.createElement("div");
    const buttonEl = document.createElement("button");
    const h1El = document.createElement("h1");
    const spanEl = document.createElement("span");
    const pEl = document.createElement("p");
    const divEl = document.createElement("div");

    //lägg till text
    buttonEl.innerHTML = "Tillbaka";
    h1El.innerHTML = beachData.attributes.name.toUpperCase();
    spanEl.innerHTML = beachData.attributes.address.street.toUpperCase() + ', ' + beachData.attributes.address.city.toUpperCase() + '<span class="fa-solid fa-location-dot"</span>';
    pEl.innerHTML = beachData.attributes.shortDescription;
    divEl.innerHTML = beachData.attributes.contentSections["17"].content;

    divButtonEl.appendChild(buttonEl);

    //lägg till i article
    articleEl.appendChild(divButtonEl);
    articleEl.appendChild(h1El);
    articleEl.appendChild(spanEl);
    articleEl.appendChild(pEl);
    articleEl.appendChild(divEl);

    //skriv ut till DOM
    resultBeachEl.appendChild(articleEl);

    buttonEl.addEventListener("click", () => {
        writeData(allData);
    })
}

/**
 * Skriver ut karta för badplats till DOM
 * och anropar väder-funktion
 * 
 * @param {string} address - textsträng med gatuadress för unik badplats
 * @returns {void} - returnerar inget värde
 */
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

/**
 * Skriver ut datum, temperatur och väderbild till DOM
 * 
 * @param {object} weatherData - väderdata från API för unik badplats
 * @returns {void} - returnerar inget värde
 */
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

/**
 * Filtrerar array från API utifrån sök-input
 * 
 * @param {array} dataArr - array med badplatser från API
 * @returns {void} - returnerar inget värde, anropar funktion
 */
function searchFilter(dataArr) {
    let input = document.querySelector("#search").value.toLowerCase();

    let dataArrFilt = dataArr.filter((data) =>
        data.attributes.name.toLowerCase().includes(input) ||
        data.attributes.address.street.toLowerCase().includes(input) ||
        data.attributes.address.city.toLowerCase().includes(input)
    );

    writeData(dataArrFilt);
}