/*
* Project: ENG1003 Assignment 2
* Purpose: This file is designed to manage the flow of the Add Location page (addLocation.html)
* Author: Zhen Yuen, Prathik, Jia Min, Yue Xin
* Last Modified: 23 May 2019 by Zhen Yuen
* Version : 1
*/



// Global variables
let map;
let marker;
let popUp;



// Generate initial map using MapBox API
window.onload = function()
{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYm9iZGFidWlsZGVyIiwiYSI6ImNqdHZybjJycDIwN2Y0Ym5yajJpZnM0eWYifQ.n7cEpOYOe7W5baY6QRaydw';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 16,
        center: [0, 0]
    });

    // Create pop-up and marker to be added to the map
    popUp = new mapboxgl.Popup().setLngLat([0, 0]);
    marker = new mapboxgl.Marker().setLngLat([0, 0]).addTo(map);
}



/*
Feature 3.1

This function is called when user inputs a new location.
The map will pan to the new location.
Once data is received, the data is passed to the callback function
panToLocation as an argument.
*/
function getLocation()
{
    // Get values from textfields
    let country = document.getElementById("addLocationCountryValue").value;
    let suburb = document.getElementById("addLocationSuburbValue").value;
    let address = suburb + ", " + country;

    // Checks if user has input details
    if (suburb && country)
    {
        // Query string to obtain coordinates of location specified by user
        const mapKey = 'RYUvx55K6sqAKjiQ6G8HP8ocxUsIWruA';
        let mapURL = "https://www.mapquestapi.com/geocoding/v1/address?key=" + mapKey + "&location=" + address +"&callback=mapResponse";
        let script = document.createElement('script');
        script.src = mapURL;
        document.body.appendChild(script);
    }
    else
    {
        alert("Please enter appropriate Suburb and Country");
    }
}



/*
Feature 3.1

This callback function is called when data has been fetched from the
MapQuest API.

Parameter:
- locationData -> Data regarding the current location returned by the MapQuest API.
*/
function mapResponse(locationData)
{
    // Extract only the required information from the data returned by MapQuest API
    let processedLocationData = locationData.results[0].locations[0];

    // Create an locationWeather object for the current location specified by user
    let latLng = processedLocationData.latLng;
    let suburb = processedLocationData.adminArea5;
    let state = processedLocationData.adminArea3;
    let country = processedLocationData.adminArea1;
    let newLocation = new LocationWeather(latLng.lat, latLng.lng, suburb, country, null);

    // Save the current location into a temporary key in local storage
    if (typeof(Storage) !== "undefined")
    {
        localStorage.setItem(APP_PREFIX + "-temporaryLocation", JSON.stringify(newLocation));
    }
    else
    {
        console.log("localStorage is not supported by current browser.");
    }

    // Pan map to location specified by user
    panToLocation(processedLocationData);
}



/*
Feature 3.1

This function is called by mapResponse();
The current location will be saved to an temporary storage if address is valid.

Parameter:
- location -> Location data
*/
function panToLocation(location)
{
    let latLng = location.latLng;
    let suburb = location.adminArea5;
    let state = location.adminArea3;
    let country = location.adminArea1;

    // Validate if location specified by user is accurate
    if (checkAddressValidity(suburb))
    {
        map.panTo([latLng.lng, latLng.lat]);

        // Remove initial pop-up and create a new one to be added to the map with the specified coordinates
        popUp.remove();
        popUp = new mapboxgl.Popup().setLngLat([latLng.lng, latLng.lat]).setText(suburb + ', ' + state + ', ' + country).addTo(map);

        // Remove initial marker and create a new one to be added to the map with the specified coordinates
        marker.remove();
        marker = new mapboxgl.Marker().setLngLat([latLng.lng, latLng.lat]).addTo(map).setPopup(popUp);
    }
}



/*
Feature 3.1

This function checks if address is valid (city level).

Parameter:
- suburb -> Address of city component

Return:
- true -> If address if valid
- false -> If address is not valid
*/
function checkAddressValidity(suburb)
{
    let buttonRef = document.getElementById("addButton");

    if (suburb === "")
    {
        // Enables the add location button
        buttonRef.disabled = true;
        alert("Invalid address entered. Please enter a more specfic address.");
        return false;
    }
    else
    {
        // Disable the add location button
        buttonRef.disabled = false;
        return true;
    }
}



/*
Feature 3.1

This function adds the selected location to the local storage when the user taps
on the add button.
User can choose whether to enter a nickname or not.
*/
function addLocation()
{
    if (typeof(Storage) !== "undefined")
    {
        // Prompts user to input a nickname for the location to be saved
        let nickname = prompt("Enter a nickname for the specifed location(Optional).");

        // Get the locationWeather object from the temporary key in local storage
        let locationWeatherFromStorage = JSON.parse(localStorage.getItem(APP_PREFIX + "-temporaryLocation"));
        let locationWeatherObject = new LocationWeather;
        locationWeatherObject.initialiseFromLocationWeatherPDO(locationWeatherFromStorage);

        locationWeatherObject.nickname = nickname;
        let locationWeatherCacheObject = loadLocations();
        locationWeatherCacheObject.addLocation(locationWeatherObject);
        saveLocations(locationWeatherCacheObject);

        location.href = "index.html";
    }
    else
    {
        console.log("localStorage is not supported by current browser.");
    }
}
