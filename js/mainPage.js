/*
* Project: ENG1003 Assignment 2
* Purpose: This file is designed to manage the flow of the main app page (index.html)
* Author: Zhen Yuen, Prathik, Jia Min, Yue Xin
* Last Modified: 23 May 2019 by Zhen Yuen
* Version : 1
*/



/*
Feature 1.3

When window loads, calls functions to generate location list and crop list
*/
window.onload = function()
{
    createLocationList();
    createCropList();
}



/*
Feature 1.4

This function is called when user taps on a location in the location list.
A selected location is then stored into the local storage.
The user is redirected to view location page.

Parameters
- locationIndex -> Index of selected location in the location list.
*/
function viewLocation(locationIndex)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationIndex);
    // And load the view location page.
    location.href = 'viewLocation.html';
}



/*
Feature 1.3

This function is called when user taps on a crop in the crop list.
The crop is removed from the crop list local storage.

Parameters
- cropIndex -> Index of crop in the list

*/
function deleteCrop(cropIndex)
{
    let cropCacheObject = loadCrops();
    let currentCropByIndex = cropCacheObject.cropAtIndex(cropIndex);
    let cropName = currentCropByIndex.name;

    if (confirm("Are you sure you want to delete " + cropName +"?") === true)
    {
        cropCacheObject.removeCropAtIndex(cropIndex);
        saveCrops(cropCacheObject);
        createCropList();
    }
}



/*
Feature 1.3

This function is called to generate a list of available locations.
*/
function createLocationList()
{
    // Converts date to YYYY-MM-DD format
    let currentSimpleDate = new Date().simpleDateString();
    let locationListRef = document.getElementById("locationList");

    // Get array of locations from Local Storage
    let locationWeatherCacheObject = loadLocations();
    let index = locationWeatherCacheObject.length();
    if (index === 0)
    {
        alert("Locations database is empty!");
    }

    // Populate list
    let item = document.createElement("li");
    let spanElement = createSpanElement(null, null, "Locations");
    spanElement.setAttribute("style", "height = 20px, padding-right: 12px")
    item.setAttribute("style", "color : #666666; background-color: #000000; line-height: 40px; padding-left: 12px");
    item.className = "mdl-layout-title";
    item.appendChild(spanElement);
    locationListRef.appendChild(item);

    for (let i = 0; i < index; i++)
    {
        let currentLocationByIndex = locationWeatherCacheObject.locationAtIndex(i);
        let latLng = currentLocationByIndex.latLng;
        let displayName = currentLocationByIndex.suburb + ", " + currentLocationByIndex.country;
        let liElement = createLiElement(null, "mdl-list__item mdl-list__item--two-line ", null);
        let spanElement1 = createSpanElement(null, "mdl-list__item-primary-content", null);
        let imgElement = createImgElement("locationIcon" + i, "mdl-list__item-icon", "list-avatar", "images/loading.png");
        let spanElement2 = createSpanElement(null, null, displayName);
        let spanElement3 = createSpanElement("temperature" + i, "mdl-list__item-sub-title", "Weather summary");

        spanElement1.appendChild(imgElement);
        spanElement1.appendChild(spanElement2);
        spanElement1.appendChild(spanElement3);
        liElement.appendChild(spanElement1);
        liElement.onclick = function() { viewLocation(i); };
        locationListRef.appendChild(liElement);

        getWeatherData(latLng, currentSimpleDate, i);
    }
}



/*
Feature 1.3

This function is called to generate a list of available crops.
*/
function createCropList()
{
    let cropListRef = document.getElementById("cropList");
    let cropCacheObject = loadCrops();

    let index = cropCacheObject.length();
    if (index === 0)
    {
        alert("Crops database is empty!");
    }

    //Delete initial contents in crop list
    while(cropListRef.lastChild)
    {
        cropListRef.removeChild(cropListRef.lastChild);
    }

    //Populate list
    let item = document.createElement("li");
    let spanElement = createSpanElement(null, null, "Crops");
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
        let liElement = createLiElement(null, "mdl-list__item mdl-list__item--two-line", null);
        let spanElement1 = createSpanElement(null, "mdl-list__item-primary-content", null);
        let spanCropElement = createSpanElement("cropIcon" + i,  "mdl-list__item-icon", null);
        let spanElement2 = createSpanElement(null, null, displayName);
        let spanElement3 = createSpanElement("crop" + i, "mdl-list__item-sub-title", cropSeason);
        spanCropElement.appendChild(getCropIcon(cropSeason, i));
        spanElement1.appendChild(spanCropElement);
        spanElement1.appendChild(spanElement2);
        spanElement1.appendChild(spanElement3);
        liElement.appendChild(spanElement1);
        liElement.onclick = function() { deleteCrop(i); };

        cropListRef.appendChild(liElement);
    }
}
