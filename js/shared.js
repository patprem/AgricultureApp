/*
* Project: ENG1003 Assignment 2
* Purpose: This file is designed to contain the required crop and location
           classes, in addition other shared functions across the app.
* Author: Zhen Yuen, Prathik, Jia Min, Yue Xin
* Last Modified: 23 May 2019 by Zhen Yuen
* Version : 2
*/



// Prefix to use for Local Storage.
let APP_PREFIX = "weatherApp";



/*
Feature 2.2

Crop class - Every crop is represented by an instance of the Crop class.
*/
class Crop
{
    constructor(name, season, minSafeTempRange, maxSafeTempRange, lowYieldOffset, tolerance)
    {
        // Private attributes:
        this._safeTempRange = [];
        this._name = name;
        this._season = season;
        this._safeTempRange[0] = minSafeTempRange;
        this._safeTempRange[1] = maxSafeTempRange;
        this._lowYieldOffset = lowYieldOffset;
        this._tolerance = tolerance;
    }

    // Public methods:
    get safeTempRange()
    {
        return this._safeTempRange;
    }

    get name()
    {
        return this._name;
    }

    get season()
    {
        return this._season;
    }

    get tolerance()
    {
        return this._tolerance;
    }

    get lowYieldOffset()
    {
        return this._lowYieldOffset;
    }


    /*
    Initialize an instance of the Crop class with a Crop PDO obtained from
    local storage.

    Parameters:
    - cropObject -> A Crop PDO obtained from local storage
    */
    initialiseFromCropPDO(cropObject)
    {
        this._safeTempRange = new Array;
        this._name = cropObject._name;
        this._season = cropObject._season;
        this._safeTempRange[0] = cropObject._safeTempRange[0];
        this._safeTempRange[1] = cropObject._safeTempRange[1];
        this._lowYieldOffset = cropObject._lowYieldOffset;
        this._tolerance = cropObject._tolerance;
    }


    /*
    Feature 3.7

    This function checks the status of the current crop given the current
    temperature of a specific location.

    Parameters:
    - temperature -> Temperature data of the current location

    Return:
    - Status of crop
    */
    checkStatus(temperature)
    {
        let minTemp = temperature[0];
        let maxTemp = temperature[1];
        let minSafeTempRange = this._safeTempRange[0];
        let maxSafeTempRange = this._safeTempRange[1];
        let tolerance = this._tolerance;
        let offset = this._lowYieldOffset;
        let survivalStatus, degreesPast, survivalDays;

        if (maxTemp <= maxSafeTempRange && minTemp >= minSafeTempRange)
        {
            return "High yield";
        }
        else if (maxTemp <= maxSafeTempRange && minTemp < minSafeTempRange)
        {
            if (minTemp > minSafeTempRange - offset)
            {
                return "Low yield";
            }
            else
            {
                degreesPast = ((minSafeTempRange - offset) - minTemp);
            }
        }
        else if (maxTemp > maxSafeTempRange && minTemp >= minSafeTempRange)
        {
            if (maxTemp < maxSafeTempRange + offset)
            {
                return "Low yield";
            }
            else
            {
                degreesPast = (maxTemp - (maxSafeTempRange + offset));
            }
        }
        else if (maxTemp > maxSafeTempRange && minTemp < minSafeTempRange)
        {
            if ((minTemp > minSafeTempRange - offset) && (maxTemp < maxSafeTempRange + offset))
            {
                return "Low yield";
            }
            else if ((minTemp <= minSafeTempRange - offset) && (maxTemp < maxSafeTempRange + offset))
            {
                degreesPast = ((minSafeTempRange - offset) - minTemp);
            }
            else if((minTemp > minSafeTempRange - offset) && (maxTemp >= maxSafeTempRange + offset))
            {
                degreesPast = (maxTemp - (maxSafeTempRange + offset));
            }
            else
            {
                degreesPast = new Array;
                degreesPast[0] = ((minSafeTempRange - offset) - minTemp);
                degreesPast[1] = (maxTemp - (maxSafeTempRange + offset));

                if (degreesPast[0] > degreesPast[1])
                {
                    degreesPast = degreesPast[1];
                }
                else
                {
                    degreesPast = degreesPast[0];
                }
            }
        }

        survivalDays = tolerance/(degreesPast + 1);
        return "Perish in " + survivalDays.toFixed(2) + " days."
    }
}



/*
Feature 2.2

CropCache class - Contains all available Crop instances.
*/
class CropCache
{
    constructor()
    {
        // Private attributes:
        this._cropList = [];
    }

    // Public methods:
    /*
    This function returns the length of the current cropCache instance's
    crop list

    Return
    - Length of the current CropCache instance's crop list
    */
    length()
    {
        return this._cropList.length;
    }


    /*
    This function returns an Crop instance from the current cropCache instance's
    crop list given the index of the Crop instance.

    Parameters:
    - cropIndex -> The index of the Crop instance in the crop list

    Returns:
    - The selected Crop instance from the crop list given its index
    */
    cropAtIndex(cropIndex)
    {
        return this._cropList[cropIndex];
    }


    /*
    This function adds a new crop object into the current cropCache instance's
    crop list.

    Parameters:
    - cropObject -> The crop instance to be added
    */
    addCrop(cropObject)
    {
        this._cropList.push(cropObject);
    }


    /*
    This function deletes an crop object from the current cropCache instance
    given the index of the crop object in the crop list.

    Parameters:
    - cropIndex -> The index of the crop instance to be removed
    */
    removeCropAtIndex(cropIndex)
    {
        this._cropList.splice(cropIndex, 1);
    }


    /*
    Initialize an instance of the CropCache class with a CropCache PDO obtained from
    local storage.

    Parameters:
    - cropCacheObject -> A CropCache PDO obtained from local storage
    */
    initialiseFromCropCachePDO(cropCacheObject)
    {
        for (let index = 0; index < cropCacheObject._cropList.length; index++)
        {
            let crop = new Crop;
            crop.initialiseFromCropPDO(cropCacheObject._cropList[index]);
            this._cropList.push(crop);
        }
    }
}



/*
Feature 3.4

LocationWeather class - Every location is represented by an instance of the LocationWeather class.
*/
class LocationWeather
{
    constructor(latitude, longitude, suburb, country, nickname)
    {
        // Private attributes:
        this._latLng = new Array;
        this._latLng[0] = latitude;
        this._latLng[1] = longitude;
        this._suburb = suburb;
        this._country = country;
        this._nickname = nickname;
        this._weatherData = {};
    }

    // Public methods:
    get latLng()
    {
        return this._latLng;
    }

    get suburb()
    {
        return this._suburb;
    }

    get country()
    {
        return this._country;
    }

    get nickname()
    {
        return this._nickname;
    }

    get weatherData()
    {
        return this._weatherData;
    }

    set nickname(nickname)
    {
        this._nickname = nickname;
    }


    /*
    This function adds a new object containing weather data
    into the weatherData attribute of the current LocationWeather instance.

    Parameters:
    - dateWeatherObject -> The object containing weather data
    */
    setWeatherData(dateWeatherObject, simpleDate)
    {
        this._weatherData[simpleDate] = dateWeatherObject;
    }


    /*
    Initialize an instance of the LocationWeather class with a LocationWeather PDO obtained from
    local storage.

    Parameters:
    - locationWeatherObject -> A locationWeather PDO obtained from local storage
    */
    initialiseFromLocationWeatherPDO(locationWeatherObject)
    {
        this._latLng = [];
        this._latLng[0] = locationWeatherObject._latLng[0];
        this._latLng[1] = locationWeatherObject._latLng[1];
        this._suburb = locationWeatherObject._suburb;
        this._country = locationWeatherObject._country;
        this._nickname = locationWeatherObject._nickname;
        this._weatherData = locationWeatherObject._weatherData;
    }
}



/*
Feature 3.4

LocationWeatherCache class - Contains all available LocationWeather instances.
*/
class LocationWeatherCache
{
    constructor()
    {
        // Private attribute:
        this._locationList = [];
    }


    /*
    This function returns the length of the current LocationWeatherCache instance's
    location list.

    Return
    - Length of the current LocationWeatherCache instance's location list.
    */
    length()
    {
        return this._locationList.length;
    }


    /*
    This function returns an instance from the current LocationWeatherCache
    instance's location list given the index of the LocationWeather instance.

    Parameters:
    - locationIndex -> The index of the LocationWeather instance selectedLocation.

    Returns:
    - The selected LocationWeather instance from the location list given its index.
    */
    locationAtIndex(locationIndex)
    {
        return this._locationList[locationIndex];
    }


    /*
    This function adds a new LocationWeather object into the current
    LocationWeatherCache instance's location list.

    Parameters:
    - locationObject -> The LocationWeather instance to be added.
    */
    addLocation(locationObject)
    {
        this._locationList.push(locationObject);
    }


    /*
    This function deletes an LocationWeather object from the current LocationWeatherCache instance
    given the index of the LocationWeather object in the location list.

    Parameters:
    - locationIndex -> The index of the crop instance to be removed.
    */
    removeLocationAtIndex(locationIndex)
    {
        this._locationList.splice(locationIndex, 1)
    }


    /*
    This function updates the selected LocationWeather object stored in the
    current LocationWeatherCache instance given the index of the LocationWeather
    object in the location list

    Parameters:
    - locationIndex -> The index of the LocationWeather instance to be updated
    - dateWeatherObject -> The object containing the new weather data
    */
    updateLocationAtIndex(locationIndex, dateWeatherObject)
    {
        this._locationList[locationIndex] = dateWeatherObject;
    }


    /*
    Initialize an instance of the LocationWeatherCache class with a LocationWeatherCache PDO obtained from
    local storage.

    Parameters:
    - LocationWeatherCacheObject -> A LocationWeatherCache PDO obtained from local storage.
    */
    initialiseFromLocationWeatherCachePDO(locationWeatherCacheObject)
    {
        for (let index = 0; index < locationWeatherCacheObject._locationList.length; index++)
        {
            let location = new LocationWeather;
            location.initialiseFromLocationWeatherPDO(locationWeatherCacheObject._locationList[index]);
            this._locationList.push(location);
        }
    }
}



/*
Feature 4.1

Load the singleton locationWeatherCache from the Local Storage.
*/
function loadLocations()
{
    if (typeof(Storage) !== "undefined")
    {
        let initialiseLocationCache = new LocationWeatherCache;

        if (localStorage.getItem(APP_PREFIX + "-locationStorage") !== null)
        {
            let locationFromStorage;
            locationFromStorage = JSON.parse(localStorage.getItem(APP_PREFIX + "-locationStorage"));
            initialiseLocationCache.initialiseFromLocationWeatherCachePDO(locationFromStorage);
        }
        else
        {
            alert("Locations database has not been created. Initializing database automatically...");
            saveLocations(initialiseLocationCache);
        }
        return initialiseLocationCache;
    }
    else
    {
        console.log("localStorage is not supported by current browser.");
    }
}



/*
Feature 4.1

Save the singleton locationWeatherCache to Local Storage.

Parameters:
- locationWeatherObject -> The instance of the LocationWeatherCache to be saved.
*/
function saveLocations(locationWeatherCacheObject)
{
    if (typeof(Storage) !== "undefined")
    {
        localStorage.setItem(APP_PREFIX + "-locationStorage", JSON.stringify(locationWeatherCacheObject));
    }
    else
    {
        console.log("localStorage is not supported by current browser.");
    }
}



/*
Feature 4.1

Load the singleton cropCache from the Local Storage.
*/
function loadCrops()
{
    if (typeof(Storage) !== "undefined")
    {
        let initialiseCropCache = new CropCache;
        if (localStorage.getItem(APP_PREFIX + "-cropStorage") !== null)
        {
            let cropCacheFromStorage;
            cropCacheFromStorage = JSON.parse(localStorage.getItem(APP_PREFIX + "-cropStorage"));
            initialiseCropCache.initialiseFromCropCachePDO(cropCacheFromStorage);
        }
        else
        {
            alert("Crops database has not been created. Initializing database automatically...");
            saveCrops(initialiseCropCache);
        }
        return initialiseCropCache;
    }
    else
    {
        console.log("localStorage is not supported by current browser.");
    }
}



/*
Feature 4.1

Save the singleton cropCache to Local Storage.

Parameters:
- cropCacheObject -> The instance of the CropCache to be saved.
*/
function saveCrops(cropCacheObject)
{
    if (typeof(Storage) !== "undefined")
    {
        localStorage.setItem(APP_PREFIX + "-cropStorage", JSON.stringify(cropCacheObject));
    }
    else
    {
        console.log("localStorage is not supported by current browser.");
    }
}



/*
Feature 1.1

This function creates a span element

Parameter:
- id -> ID of the element to be created
- class1 -> Class attribute of the element
- innerHTML -> InnerHTML of the element
*/
function createSpanElement(id, class1, innerHTML)
{
    let element = document.createElement("span");
    element.classList.add(class1);
    element.id = id;
    element.innerHTML = innerHTML;
    return element;
}



/*
Feature 1.1

This function creates a li element

Parameter:
- id -> ID of the element to be created
- class1 -> Class attribute of the element
- innerHTML -> InnerHTML of the element
*/
function createLiElement(id, class1, innerHTML)
{
    let element = document.createElement("li");
    element.setAttribute("class", class1);
    element.id = id;
    element.innerHTML = innerHTML;
    return element;
}



/*
Feature 1.1

This function creates an img  element

Parameter:
- id -> ID of the element to be created
- class1 -> First class attribute of the element
- class2 -> Second class attribute of the element
- src -> Source of the element
*/
function createImgElement(id, class1, class2, src)
{
    let element = document.createElement("img")
    element.classList.add(class1, class2);
    element.id = id;
    element.src = src;
    return element;
}



/*
Feature 3.3

This function obtains the weather data for a given location for a specified date

Parameter:
- latLng -> The latitude and longitude of the location
- simpleDate -> Date in simple format
- locationIndex -> Index of current location in the location list of the
                   LocationWeatherCache instance
*/
function getWeatherData(latLng, simpleDate, locationIndex)
{
    let locationWeatherCacheObject = loadLocations();
    let currentLocationByIndex = locationWeatherCacheObject.locationAtIndex(locationIndex);
    if (typeof(currentLocationByIndex.weatherData[simpleDate]) === "undefined")
    {
        let darkSkydate = new Date(simpleDate).darkSkyDateString();
        const key = "f3c68769ff091e1e1ad45cca2dff1be5";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const apiUrl = proxy + "https://api.darksky.net/forecast/" + key + "/" + latLng + "," + darkSkydate + "?units=si";

        // Fetch data from DarkSky API
        fetch(apiUrl)
        .then((response) => {
            return response.json();
        })
        .then((weatherData) => {
            processWeatherData(weatherData, simpleDate, locationIndex);
        });
    }
    else
    {
        let weatherData = currentLocationByIndex.weatherData[simpleDate];
        displayWeatherData(weatherData, locationIndex);
    }
}



/*
Feature 3.3

This function obtains the weather data for a given location for a specified date

Parameter:
- latLng -> The latitude and longitude of the location
- simpleDate -> Date in simple format
- locationIndex -> Index of current location in the location list of the
                   LocationWeatherCache instance
*/
function processWeatherData(weatherData, simpleDate, locationIndex)
{
    let locationWeatherCacheObject = loadLocations();
    let currentLocationByIndex = locationWeatherCacheObject.locationAtIndex(locationIndex);
    let temperatureMax = weatherData.daily.data[0].temperatureMax;
    let temperatureMin = weatherData.daily.data[0].temperatureMin;
    let temperature = [temperatureMin, temperatureMax];
    let iconSrc = weatherData.currently.icon;

    // Save weather data into local storage
    currentLocationByIndex.setWeatherData([temperature, iconSrc], simpleDate);
    locationWeatherCacheObject.updateLocationAtIndex(locationIndex, currentLocationByIndex);
    saveLocations(locationWeatherCacheObject);

    displayWeatherData([temperature, iconSrc], locationIndex);
}



/*
Feature 3.3

This function obtains the weather data for a given location for a specified date

Parameter:
- latLng -> The latitude and longitude of the location
- simpleDate -> Date in simple format
- locationIndex -> Index of current location in the location list of the
                   LocationWeatherCache instance
*/
function displayWeatherData(response, locationIndex)
{
    if (typeof(response) !== "undefined")
    {
        let iconRef = document.getElementById("locationIcon" + locationIndex);
        let temperatureRef = document.getElementById("temperature" + locationIndex);
        let cropStatusRef;
        let cropCacheObject = loadCrops();
        let index = cropCacheObject.length();
        let currentCropByIndex;
        let status;

        for (let i = 0; i < index ; i++)
        {
            cropStatusRef = document.getElementById("status" + i);
            if (cropStatusRef !== null)
            {
                currentCropByIndex = cropCacheObject.cropAtIndex(i);
                status = currentCropByIndex.checkStatus(response[0]);
                cropStatusRef.innerHTML = "Status: " + status;
            }
        }

        iconRef.src = "images/" + response[1] + ".png";
        temperatureRef.innerHTML = "Temps :  " + response[0][0] + " to " + response[0][1] + " &#8451";
    }
}



/*
Feature 3.3

This function returns the icon for each crop based on their seasons

Parameter:
- season -> The season of the given crop
- cropIndex -> The index of the current crop in the crop list of the CropCache instance

Return:
- The icon element to be displayed
*/
function getCropIcon(season, cropIndex)
{
    let src, iconElement;
    let seasonLowerCase = season.toLowerCase();
    if (seasonLowerCase.includes("summer"))
    {
        src = 'fas fa-sun';
    }
    else if (seasonLowerCase.includes("spring"))
    {
        src = 'fas fa-seedling';
    }
    else if (seasonLowerCase.includes("autumn"))
    {
        src = "fas fa-tree";
    }
    else if (seasonLowerCase.includes("winter"))
    {
        src = "fas fa-icicles";
    }

    iconElement =  document.createElement('i');
    iconElement.setAttribute('class', src);
    return iconElement;
}
