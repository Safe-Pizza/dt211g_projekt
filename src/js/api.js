"use strict";

//hämta JSON-data
async function fetchData() {
    try {
        const response = await fetch("https://services-eu1.arcgis.com/81H0sgjoIWj6WxIM/arcgis/rest/services/Dricksvattenfont%C3%A4ner/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json");
        const data = await response.json();

        console.log(data.features);

    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}