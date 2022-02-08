/*
* Project: ENG1003 Assignment 2
* Purpose: This file is designed to manage the flow of the add crop page (addCrop.html)
* Author: Zhen Yuen, Prathik, Jia Min, Yue Xin
* Last Modified: 23 May 2019 by Zhen Yuen
* Version : 1
*/



/*
Feature 2.1

This function is called when user taps on add button.
A dialog will pop up, asking for confirmation from the user.
The crop input will then be added to the local storage.
The user is redirected to the main page.
*/
function saveCrop()
{
    let name, season, minSafeTempRange, maxSafeTempRange, lowYieldOffset, tolerance;

    // Get values from textfields
    name = document.getElementById("addCropNameValue").value;
    season = document.getElementById("addCropSeasonValue").value;
    maxSafeTempRange = Number(document.getElementById("addCropMaxSafeTempRangeValue").value);
    minSafeTempRange = Number(document.getElementById("addCropMinSafeTempRangeValue").value);
    lowYieldOffset =Number(document.getElementById("addCropLowYieldOffsetValue").value);
    tolerance = Number(document.getElementById("addCropToleranceValue").value);

    // Checks if user has input all details
    if ( name !== "" && season !== "" && maxSafeTempRange !== 0 && minSafeTempRange !== 0 && lowYieldOffset !== 0 && tolerance !== 0)
    {
        // Checks if user's input is valid
        if ( !isNaN(maxSafeTempRange) && !isNaN(minSafeTempRange) && !isNaN(lowYieldOffset) && !isNaN(tolerance))
        {
            // Checks if low yield offset and tolerance is positive numbers
            if (lowYieldOffset >= 0 && tolerance >= 0 )
            {
                // Checks if maximum safe temperature must be greater than minimum safe temperature
                if (maxSafeTempRange >= minSafeTempRange)
                {
                    // Prompts user for confirmation before saving the crop
                    if (confirm("Are you sure you want to add " + name + "?") === true)
                    {
                        if (typeof(Storage) !== "undefined")
                        {
                            let cropCacheObject = loadCrops();
                            let crop = new Crop(name, season, minSafeTempRange, maxSafeTempRange, lowYieldOffset, tolerance);
                            cropCacheObject.addCrop(crop);
                            localStorage.setItem(APP_PREFIX + "-cropStorage", JSON.stringify(cropCacheObject));
                        }
                        else
                        {
                            console.log("localStorage is not supported by current browser.");
                        }

                        location.href = "index.html";
                    }
                }
                else
                {
                    alert("The maximum safe temperature must be greater than the minimum safe temperature!");
                }
            }
            else if (lowYieldOffset < 0)
            {
                alert("The low yield offset(degrees) of the crop cannot be negative!");
            }
            else if (tolerance < 0)
            {
                alert("The tolerance(in days) of the crop cannot be negative!");
            }
            else if (tolerance < 0 && lowYieldOffset < 0)
            {
                alert("The low yield offset(degrees) and tolerance(in days) of the crop cannot be negative!");
            }
        }
        else
        {
            alert("Mininimum/maximum safe temperature, low yield offset, and tolerance MUST all be NUMBERS.");
        }
    }
    else
    {
        alert("Please input all crop details!")
    }
}
