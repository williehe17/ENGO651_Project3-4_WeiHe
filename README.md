ENGO651 Lab 3 – Calgary Building Permits Web Map

This project is a web mapping application that visualizes building permits in Calgary using the City of Calgary Open Data API. The application allows users to search for building permits within a selected date range and display them on an interactive map.

The project uses Leaflet.js for mapping and combines data from the Open Calgary API to build a simple geospatial web application.

Features
Interactive Map

When the webpage loads, a Leaflet map centered on Calgary is displayed using OpenStreetMap tiles.

Date Range Search

Users can select a date range using a Flatpickr date picker and search for building permits issued during that time.

The application sends a request to the Calgary Open Data API and retrieves permits within the selected date range.

Permit Markers

Each building permit returned from the API is displayed as a marker on the map.

Permit Information Popup

Clicking a marker displays detailed information about the permit, including:

issueddate

workclassgroup

contractorname

communityname

originaladdress

Marker Clustering

When many permits appear in the same area, markers are grouped using the Leaflet MarkerCluster plugin. This improves map readability and performance.

Clusters automatically expand as the user zooms in.

Overlapping Marker Handling

Some permits share the same coordinates. The application uses the OverlappingMarkerSpiderfier plugin to spread markers apart when clicked so users can select individual permits.

Clear Search

The Clear button removes all markers from the map and resets the search input.

Project Structure

project-folder

index.html
app.js
style.css
config.js
README.md

index.html
Contains the webpage layout, map container, and external library links.

app.js
Contains the main application logic including:

map initialization

API queries

marker creation

clustering

overlapping marker handling

style.css
Provides styling for the interface and map layout.

config.js
Stores API configuration values.

How to Run the Application

Clone or download the repository

git clone YOUR_REPOSITORY_LINK

Open the project folder in Visual Studio Code

Run a local server

You can use the Live Server extension in VS Code or run:

python -m http.server

Open the application in a browser

http://localhost:5500/index.html

Data Source

City of Calgary Open Data Portal

Dataset: Building Permits

API Endpoint
https://data.calgary.ca/resource/c2es-76ed.geojson

Technologies Used

Leaflet.js
Leaflet MarkerCluster
OverlappingMarkerSpiderfier
Flatpickr
OpenStreetMap
Calgary Open Data API

Author

Wei He
Geomatics Engineering MEng
University of Calgary