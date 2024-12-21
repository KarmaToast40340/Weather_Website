window.addEventListener("DOMContentLoaded", init);

async function init() {
    const searchBtn = document.querySelector("button");
    const searchInput = document.querySelector("#site-search");

    // Charger la météo de Lannion par défaut
    const defaultCity = "Lannion";
    loadWeather(defaultCity);

    // Ajouter un écouteur d'événement pour rechercher une autre ville
    searchBtn.addEventListener("click", () => {
        const city = searchInput.value.trim();
        if (city) {
            loadWeather(city);
        }
    });
}

async function loadWeather(city) {
    try {
        // Étape 1 : Obtenir les coordonnées GPS de la ville
        const coordinates = await getCityCoordinates(city);

        // Étape 2 : Obtenir les données météo
        if (coordinates) {
            const { lat, lon } = coordinates;
            const weatherData = await getWeatherData(lat, lon);

            // Étape 3 : Afficher les données météo
            displayWeather(city, weatherData);
        } else {
            alert("Ville introuvable !");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

async function getCityCoordinates(city) {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
        const { geometry } = data.features[0];
        return { lat: geometry.coordinates[1], lon: geometry.coordinates[0] };
    } else {
        return null;
    }
}

async function getWeatherData(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    return data.current_weather;
}

function displayWeather(city, weather) {
    const weatherContainer = document.querySelector("#weather-container");
    weatherContainer.innerHTML = ""; // Vider le conteneur avant d'ajouter de nouvelles données

    if (weather) {
        // Traduction des codes météo
        const weatherCodes = {
            0: "Ciel clair",
            1: "Principalement clair",
            2: "Partiellement nuageux",
            3: "Couvert",
            45: "Brouillard",
            48: "Brouillard givrant",
            // Ajouter d'autres codes selon vos besoins
        };

        const weatherDescription = weatherCodes[weather.weathercode] || "Code météo inconnu";

        // Création des éléments à afficher
        const cityElement = document.createElement("h2");
        cityElement.textContent = `Météo à ${city}`;

        const temperatureElement = document.createElement("p");
        temperatureElement.textContent = `Température : ${weather.temperature}°C`;

        const weatherCodeElement = document.createElement("p");
        weatherCodeElement.textContent = `Condition : ${weatherDescription}`;

        const windspeedElement = document.createElement("p");
        windspeedElement.textContent = `Vent : ${weather.windspeed} km/h`;

        // Ajout des éléments au conteneur
        weatherContainer.appendChild(cityElement);
        weatherContainer.appendChild(temperatureElement);
        weatherContainer.appendChild(weatherCodeElement);
        weatherContainer.appendChild(windspeedElement);
    } else {
        weatherContainer.textContent = "Données météo indisponibles.";
    }
}
