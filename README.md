# Web Development Project for ENSSAT

This project is part of a web development assignment at ENSSAT (École Nationale Supérieure des Sciences Appliquées et de Technologie). The goal of this project is to create an interactive weather application that displays weather data based on geographic locations in France. The application utilizes a map of France (in SVG format) and allows users to either click on the map to get the weather for a specific region or search for a French city to retrieve weather information.

## APIs Used

### 1. **Meteo API (Open-Meteo)**

The weather data is fetched using the [Open-Meteo API](https://open-meteo.com/en). This API provides current weather conditions based on latitude and longitude coordinates. The API returns data such as temperature, wind speed, and weather conditions, which are displayed on the website.

The request URL used to fetch weather data is:
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&timezone=auto
```
Where `{lat}` and `{lon}` are the latitude and longitude coordinates of the selected location.

### 2. **Geo-Location API (API-Adresse from French Government)**

The application also makes use of the [API-Address from the French Government](https://api-adresse.data.gouv.fr/) to convert a city name into geographical coordinates (latitude and longitude). This API allows us to search for cities in France by name and retrieve their coordinates, which are then used to fetch the weather data.

The request URL to fetch coordinates for a city is:
```
https://api-adresse.data.gouv.fr/search/?q={city_name}
```
Where `{city_name}` is the city entered by the user in the search bar.

## Interactive Map (SVG)

The main feature of the application is an interactive map of France. The map is in SVG (Scalable Vector Graphics) format and allows users to click on different regions to get the weather information for that area. The map's coordinates are mapped to geographical coordinates (latitude and longitude) using a conversion function, which calculates the corresponding geographical location based on where the user clicks on the SVG.

### SVG Coordinates Conversion

When a user clicks on the map, the mouse position (in SVG coordinates) is converted into geographical coordinates (latitude and longitude) based on the predefined bounds of France. This allows the app to provide accurate weather data based on the specific location clicked on the map.

## Implementation Steps

### 1. **Setting Up the Map**

We started by creating an SVG of France, which acts as the map that the user interacts with. The SVG has fixed geographical bounds (north, south, east, and west) to map the pixel values of the SVG to real-world geographical coordinates.

### 2. **Handling User Interaction**

We added an event listener for clicks on the SVG. When the user clicks on the map, the app calculates the latitude and longitude of the click location and displays the coordinates on the page. Then, it fetches the weather data using these coordinates from the Open-Meteo API.

### 3. **City Search**

In addition to the clickable map, we implemented a search bar that allows users to type in the name of a French city. When a user types a city name and clicks the "Search" button, the app fetches the coordinates of that city using the French Government’s API. Once the coordinates are obtained, the weather data is retrieved and displayed for that city.

### 4. **Displaying Weather Data**

The weather data is displayed on the page, including information such as:
- Temperature (in °C)
- Weather condition (based on a weather code)
- Wind speed (in km/h)

We used a function called `displayWeatherData` to display this data in a readable format. The weather data is shown on the right side of the map, providing a clear view of the selected region's weather.

### 5. **Styling and Layout**

The layout was created using **CSS Flexbox**, which allows for an easy, responsive design. The map and weather data are aligned horizontally, with the map on the left and the weather information on the right. This layout ensures the user can easily view both the map and the weather details at the same time.

## Final Result

The final result is a user-friendly web application that allows users to:
- Click on different regions of the France map to get weather data.
- Search for a specific city in France and view the corresponding weather data.
- View detailed weather information such as temperature, weather condition, and wind speed.

## Conclusion

This project demonstrates how to combine multiple APIs and interactive elements to build a useful web application. The combination of SVG, geolocation services, and weather APIs makes the app both dynamic and informative. It also helped improve skills in working with APIs, handling user input, and applying modern web design principles.

