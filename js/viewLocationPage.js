/*
* Project: ENG1003 Assignment 2
* Purpose: This file is designed to manage the flow of the View Location page (viewLocation.html)
* Author: Zhen Yuen, Prathik, Jia Min, Yue Xin
* Last Modified: 23 May 2019 by Zhen Yuen
* Version : 2
*/



window.onload = function()
{
    // Get location index from local storage.
    var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");

    if (locationIndex !== null)
    {
        // Get current date
        let currentDate = new Date();
        let simpleDate = currentDate.simpleDateString();
        let locationWeatherCacheObject = loadLocations();
        let currentLocationByIndex = locationWeatherCacheObject.locationAtIndex(locationIndex);
        let latLng = currentLocationByIndex.latLng;
        let locationName = currentLocationByIndex.suburb + ", " + currentLocationByIndex.country;

        // If a location name was specified, use it for header bar title.
        document.getElementById("headerBarTitle").textContent = locationName;
        document.getElementById("icon").id = "locationIcon" + locationIndex;
        document.getElementById("temperature").id = "temperature" + locationIndex;
        document.getElementById("dateDisplay").innerHTML = "Date: " + simpleDate;

        // Generate date options for user to select
        let year = Number(simpleDate.split("-")[0]);
        let yearOption1 = document.createElement('option');
        let yearOption2 = document.createElement('option');
        yearOption1.value = year;
        yearOption1.appendChild(document.createTextNode(year));
        document.getElementById("yearList").appendChild(yearOption1);
        yearOption2.value = year - 1;
        yearOption2.appendChild(document.createTextNode((year - 1)));
        document.getElementById("yearList").appendChild(yearOption2);

        generateMap(currentLocationByIndex);
        addOnclickToGetWeatherButton(locationIndex);
        addOnclickToDeleteButton(locationIndex);
        updateCropInSeasonList(simpleDate);
        getWeatherData(latLng, simpleDate, locationIndex);
    }
}



/*
Feature 3.2

This function is called to generate a map showing the current location.

Parameters
- currentLocationByIndex -> A  LocationWeather object containing details
                            of the current location.
*/
function generateMap(currentLocationByIndex)
{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYm9iZGFidWlsZGVyIiwiYSI6ImNqdHZybjJycDIwN2Y0Ym5yajJpZnM0eWYifQ.n7cEpOYOe7W5baY6QRaydw';

    let latLng = currentLocationByIndex.latLng;
    let address = currentLocationByIndex.suburb + ", " + currentLocationByIndex.country;
    let nickname = currentLocationByIndex.nickname;

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 16,
        center: [latLng[1], latLng[0]]
    });

    //Create pop-up and marker to be added to the map
    let popUp = new mapboxgl.Popup().setLngLat([latLng[1], latLng[0]]).setText(nickname + ' (' + address + ')').addTo(map);
    let marker = new mapboxgl.Marker().setLngLat([latLng[1], latLng[0]]).addTo(map).setPopup(popUp);
}



/*
Feature 3.2

This function is called to add an onclick property to the delete button in
the view location page.

Parameters
- locationIndex -> The index of the current location in the location list of the
                   current LocationWeatherCache instance
*/
function addOnclickToDeleteButton(locationIndex)
{
    let deleteButtonRef = document.getElementById("deleteButton");
    deleteButtonRef.onclick = function(){ deleteLocation(locationIndex);};
}



/*
Feature 3.2

This function is called to add an onclick property to the get weather button in
the view location page.

Parameters
- locationIndex -> The index of the current location in the location list of the
                   current LocationWeatherCache instance
*/
function addOnclickToGetWeatherButton(locationIndex)
{
    let getWeatherButtonRef = document.getElementById("getWeatherButton");
    getWeatherButtonRef.onclick = function(){
        updateDateAndWeather(locationIndex);
    };
}



/*
Feature 3.2

This function is called when the user enters a new date and clicks on the get
weather button

Parameters
- locationIndex -> The index of the current location in the location list of the
                   current LocationWeatherCache instance
*/
function updateDateAndWeather(locationIndex)
{
    let locationWeatherCacheObject = loadLocations();
    let currentLocationByIndex = locationWeatherCacheObject.locationAtIndex(locationIndex);
    let latLng = currentLocationByIndex.latLng;
    let simpleDate;

    let day = Number(document.getElementById("dayList").value);
    let month = Number(document.getElementById("monthList").value);
    let year = Number(document.getElementById("yearList").value);
    simpleDate = year + "-" + month + "-" + day;

    if (checkDateValidity(day, month, year))
    {
        //Use proper date instead of user input
        let normalDate = new Date(simpleDate);
        let realSimpleDate = normalDate.simpleDateString();

        if (simpleDate !== null)
        {
            if (normalDate.toString() === "Invalid Date")
            {
                alert("Invalid date entered. Please try again.");
            }
            else
            {
                document.getElementById("dateChangeStatus").innerHTML = "Date changed successfully."
                document.getElementById("dateDisplay").innerHTML = "Date: " + realSimpleDate;
                updateCropInSeasonList(realSimpleDate);
                getWeatherData(latLng, realSimpleDate, locationIndex);
            }
        }
    }
    else
    {
        alert("Invalid date entered. Date must be 365 days before current date.");
    }
}



/*
Feature 1.5

This function is called when user taps on delete button.
A dialog will pop up, asking for confirmation from the user.
The current location will then be removed from the local storage.
The user is redirected to the main page.

Parameters
- locationIndex -> The index of the current location in the location list of the
                   current LocationWeatherCache instance
*/
function deleteLocation(locationIndex)
{
    let locationWeatherCacheObject = loadLocations();
    let currentLocationByIndex = locationWeatherCacheObject.locationAtIndex(locationIndex);
    let locationName = currentLocationByIndex.suburb + ", " + currentLocationByIndex.country;

    // Prompts user for confirmation before deleting location
    if (confirm("Are you sure you want to delete " + locationName +"?") === true)
    {
        locationWeatherCacheObject.removeLocationAtIndex(locationIndex);
        saveLocations(locationWeatherCacheObject);
        location.href = "index.html";
    }
}



/*
Feature 3.8

This function is called display a list of crops that are currently in season.

Parameters
- simpleDate -> Date in simple format.
*/
function updateCropInSeasonList(simpleDate)
{
    let currentSeason = getCurrentSeason(simpleDate);
    document.getElementById("currentSeason").innerHTML = "Current season: " + currentSeason;

    //Crop data
    let cropListRef = document.getElementById("cropList");

    // Load crops from Storage
    let cropCacheObject = loadCrops();

    let index = cropCacheObject.length();
    if (index === 0)
    {
        alert("Crops database is empty!");
    }

    //Delete initial contents of crop list
    while(cropListRef.lastChild)
    {
        cropListRef.removeChild(cropListRef.lastChild);
    }

    //Populate list with updated information
    let item = document.createElement("li");
    let spanElement = createSpanElement(null, null, "Crops In Season");
    spanElement.setAttribute("style", "height = 20px, padding-right: 12px")
    item.setAttribute("style", "color : #666666; background-color: #000000; line-height: 40px; padding-left: 12px");
    item.className = "mdl-layout-title";
    item.appendChild(spanElement);
    cropListRef.appendChild(item);

    for (let i = 0; i < index; i++)
    {
        let currentCropByIndex = cropCacheObject.cropAtIndex(i);
        let displayName = currentCropByIndex.name;
        let cropSeason = currentCropByIndex.season;
        let safeTempRange = currentCropByIndex.safeTempRange;
        let safeTempRangeDisplay = "Safe temp. range: " + safeTempRange[0] + " - " + safeTempRange[1] + " &#8451";

        // Checks if crop is currently in season
        if (cropSeason.includes(currentSeason))
        {
            let liElement = createLiElement(null, "mdl-list__item mdl-list__item--two-line", null);
            let spanElement1 = createSpanElement(null, "mdl-list__item-primary-content", null);
            let spanElement2 = createSpanElement(null, null, displayName);
            let spanElement3 = createSpanElement(null,  "mdl-list__item-sub-title", safeTempRangeDisplay);
            let spanElement4 = createSpanElement("status" + i, "mdl-list__item-sub-title", "Status");
            liElement.setAttribute("style", "width:100%; background-color: #d2a679")
            spanElement1.appendChild(spanElement2);
            spanElement1.appendChild(spanElement3);
            spanElement1.appendChild(spanElement4);
            liElement.appendChild(spanElement1);

            cropListRef.appendChild(liElement);
        }
    }
}



/*
Feature 3.6

This function is called to get the current season given a date.

Parameters
- simpleDate -> Date in simple format.

Returns
- Current season in the form of a string.
*/
function getCurrentSeason(simpleDate)
{
    let seasonAvailable;

    let monthToBeCompared = Number(simpleDate.split("-")[1]);

    if (monthToBeCompared >= 9 && monthToBeCompared <=11)
    {
        seasonAvailable = "Spring";
    }
    else if (monthToBeCompared === 1 || monthToBeCompared === 2 || monthToBeCompared === 12)
    {
        seasonAvailable = "Summer";
    }
    else if (monthToBeCompared >= 3 && monthToBeCompared <= 5)
    {
        seasonAvailable = "Autumn";
    }
    else if (monthToBeCompared >= 6 && monthToBeCompared <= 8)
    {
        seasonAvailable = "Winter";
    }
    return seasonAvailable;
}



/*
This function checks if the date selected by user is within 365 days before the current date.

Returns
- If yes, returns true.
- If no, returns false.
*/
function checkDateValidity(day, month, year)
{
    // Get current date for comparison
    let currentDate = new Date().simpleDateString();
    let yearToBeCompared = Number(currentDate.split("-")[0]);
    let monthToBeCompared = Number(currentDate.split("-")[1]);
    let dayToBeCompared = Number(currentDate.split("-")[2]);

    if (year < yearToBeCompared)
    {
        if (month > monthToBeCompared)
        {
            return true;
        }
        else if (month === monthToBeCompared)
        {
            if (day >= dayToBeCompared)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    else if (year === yearToBeCompared)
    {
        if (month < monthToBeCompared)
        {
            return true;
        }
        else if (month === monthToBeCompared)
        {
            if (day <= dayToBeCompared)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}
