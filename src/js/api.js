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