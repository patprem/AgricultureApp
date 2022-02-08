# Agriculture App

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#why-is-this-app-important">Why is this app important?</a></li>
      </ul>
      <ul>
        <li><a href="#prerequisites">Prerequisites?</a></li>
      </ul>
    </li>
    <li>
      <a href="#structure-of-the-app">Structure of the App</a>
      <ul>
        <li><a href="#main-page">Main Page</a></li>
      </ul>
      <ul>
        <li><a href="#add-crops-page">Add Crops Page</a></li>
      </ul>
      <ul>
        <li><a href="#add-locations-page">Add Locations Page</a></li>
      </ul>
      <ul>
        <li><a href="#view-locations-page">View Locations Page</a></li>
      </ul>
    </li>
    <li><a href="#installtion">Installation</a></li>
    <li><a href="#contribute">Contribute</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a>
    
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

A proof-of-concept app that utilizes existing location mapping and weather forecasting services, to present the user with historical temperature data and assist with their decisions in growing sustainable crops. This app is built using HTML, CSS, JavaScript and APIs such as [Mapbox API](https://docs.mapbox.com/api/overview/), Dark Sky API and [MapQuest's Geocoding API](https://developer.mapquest.com/documentation/geocoding-api/).

### Why is this app important?
* Assist farmers with preparation for water shortages, parasites, and other factors, such as adverse effects of climate changes, affecting the quality of their crops.
* Assist farmers with their decisions in growing sustainable crops based on recent temperature readings.
* Hassle-free for farmers as they do not need to move between different locations to find out where to cultivate their crops.
* Predict effect of weather on crops (yield and tolerance).
* Obtain weather information for all locations, ranging from today up to 365 days in the past using Mapbox API.
* Store any desired crops and locations.

### Prerequisites
* Android/iOS device
* Internet connection
* Browser support (Google Chrome, preferably)

<p align="right">(<a href="#top">back to top</a>)</p>

##  Structure of the App
1. Main Page
2. Add Crops Page
3. Add Locations Page
4. View Locations Page

### Main Page

<p align = "center">
  <img src = "https://github.com/patprem/AgricultureApp/blob/f7f9adca00eaa60b5d157a268b721d1b3061f382/images/fig1.png" width = 400 height = 400>
</p>

* Home Page.
* User is able to view a list of crops and locations.
* Icon beside each location represents today's weather
* Icon beside each crop represents the season for which the crop will be grown

<p align="right">(<a href="#top">back to top</a>)</p>

### Add Crops Page

<p align = "center">
  <img src="https://github.com/patprem/AgricultureApp/blob/1c41295cac8ea1c01b55c59f03803e95df225b1f/images/media1.gif" width="200" height="400" />
  <img src="https://github.com/patprem/AgricultureApp/blob/676bf0eef21ff01d0539bbfff9a82e7f4e3f5b6f/images/fig2.png" width="200" height="400" />
</p>

* Allows users to add desired crop into app’s database. 
* Enter all relevant information of crop such as:
  - Season at which the crop is grown
  - Name of the crop
  - Minimum safe temperature for the crop
  - Maximum safe temperature for the crop
  - Low Yield Offset of the crop
  - Tolerance of crop in days
* Then, tap the “ADD” button.
* Desired crop will then be successfully added into app’s database and display in the list of crops on the main page.

<p align="right">(<a href="#top">back to top</a>)</p>

### Add Locations Page

<p align = "center">
  <img src="https://github.com/patprem/AgricultureApp/blob/769337b1e96b3b763a1f0dc72f189a2de0b52877/images/media2.gif" width="200" height="400" />
  <img src="https://github.com/patprem/AgricultureApp/blob/769337b1e96b3b763a1f0dc72f189a2de0b52877/images/fig3.png" width="200" height="400" />
</p>

* Allows the user to add the desired location.
* User must input the name of the suburb and country of the location to be added.
* The map will pan to the desired location, displaying a marker and a pop-up text on top of the desired location, upon tapping the "PAN" button.
* User is given the option to add a nickname to the selected location, for example: Home, upon tapping the "ADD" button.
* Desired location will then be successfully added into app’s database and display in the list of locations on the main page.
* Crops that are suitable to be planted on the specific day that fits the temperature range would also be indicated. 

<p align="right">(<a href="#top">back to top</a>)</p>

### View Locations Page

<p align = "center">
  <img src="https://github.com/patprem/AgricultureApp/blob/f44d4e60767c5edef38c93fc8845dbd80393f0c5/images/fig4.png" width="450" height="400" />
</p>

* Current season, temperature range, weather, selected location for specific date and crops in season is displayed using Dark Sky API.
* Drawer appears from left when tapped on menu on the right of header bar.
* Allows user to:
  - Set date of location
  - Delete location
* User can set current date of location to any desired date by tapping on the "Calendar" icon.
* Weather data and list of crops currently in season will be updated according to new date specified.
* User is given the option to delete crops and locations from the app's database by simply clicking on the crop/location.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- INSTALLATION -->
## Installation

* Open Windows Command Prompt or any other terminal window and clone repo:
``` sh
https://github.com/patprem/AgricultureApp.git
```
OR

Just click on ``` Download ZIP ``` from Code tab on main page of this repo.

* Open  ``` index.html ``` to use the app.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTE -->
## Contribute

If you like this project and interested to contribute:
* Please show your support by ⭐ (star) the project.
* Submit pull requests and improve the repo overall quality.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments
The codes used in this project borrows from Monash University and rewritten to incorporate into my project.

<p align="right">(<a href="#top">back to top</a>)</p>



