window.addEventListener("DOMContentLoaded", init);

let currentCityChart = null;  // Nouvelle variable pour éviter le conflit

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

        // Étape 2 : Obtenir les données météo actuelles
        if (coordinates) {
            const { lat, lon } = coordinates;
            const weatherData = await getWeatherData(lat, lon);

            // Étape 3 : Afficher les données météo actuelles
            displayWeather(city, weatherData);

            // Étape 4 : Récupérer l'historique des températures
            const temperatureHistory = await getTemperatureHistory(lat, lon);
            displayTemperatureChart(city, temperatureHistory);

            // Ajouter un événement au bouton de téléchargement
            const downloadButton = document.getElementById("download-csv");
            downloadButton.addEventListener("click", () => downloadCSV(city, temperatureHistory));
        } else {
            alert("Ville introuvable !");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

function displayTemperatureChart(city, temperatureData) {
    const ctx = document.getElementById("temperature-chart").getContext("2d");

    // Si un graphique existe déjà, détruisez-le avant de créer un nouveau graphique
    if (currentCityChart) {
        currentCityChart.destroy();
    }

    const labels = temperatureData.time.map((date) => new Date(date).toLocaleDateString());
    const maxTemps = temperatureData.temperature_2m_max;
    const minTemps = temperatureData.temperature_2m_min;

    // Créer un nouveau graphique
    currentCityChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Max Temperatures in ${city}`,
                    data: maxTemps,
                    borderColor: "red",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    fill: false,
                },
                {
                    label: `Min Temperatures in ${city}`,
                    data: minTemps,
                    borderColor: "blue",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Temperature (°C)",
                    },
                },
            },
        },
    });
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
            51: "Bruine légère",
            53: "Bruine modérée",
            55: "Bruine dense",
            56: "Bruine verglaçante légère",
            57: "Bruine verglaçante dense",
            61: "Pluie faible",
            63: "Pluie modérée",
            65: "Pluie forte",
            66: "Pluie verglaçante légère",
            67: "Pluie verglaçante forte",
            71: "Chute de neige légère",
            73: "Chute de neige modérée",
            75: "Chute de neige forte",
            77: "Grains de neige",
            80: "Averses de pluie faible",
            81: "Averses de pluie modérée",
            82: "Averses de pluie violente",
            85: "Averses de neige légère",
            86: "Averses de neige forte",
            95: "Orages faibles ou modérés",
            96: "Orages avec grêle légère",
            99: "Orages avec grêle forte",
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

        const habits = document.createElement("p");
        habits.textContent = `Habits conseillés :`;

        const imageElement = document.createElement("img");
        switch (weather.weathercode) {
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
                imageElement.src = "./images/Shrek_pluie.png";
                break;
            case 0:
            case 1:
            case 2:
            case 3:
                imageElement.src = "./images/Shrek_clear.png";
                break;
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
                imageElement.src = "./images/Shrek_neige.png";
                break;
            case 45:
            case 48:
                imageElement.src = "./images/Shrek_fog.png";
                break;
            case 81:
            case 82:
            case 95:
            case 96:
            case 99:
                imageElement.src = "./images/Shrek_orage.png";
                break;
            default:
                imageElement.src = "./images/Shrek_clear.png";
                break;
        }
        imageElement.id = "weather-image";

        // Ajout des éléments au conteneur
        weatherContainer.appendChild(cityElement);
        weatherContainer.appendChild(temperatureElement);
        weatherContainer.appendChild(weatherCodeElement);
        weatherContainer.appendChild(windspeedElement);
        weatherContainer.appendChild(habits);
        weatherContainer.appendChild(imageElement);
    } else {
        weatherContainer.textContent = "Données météo indisponibles.";
    }
}

async function getTemperatureHistory(lat, lon) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const data = await response.json();
    return data.daily;
}

function downloadCSV(city, temperatureData) {
    const csvContent = [
        ["Date", "Max Temperature (°C)", "Min Temperature (°C)"],
        ...temperatureData.time.map((date, index) => [
            date,
            temperatureData.temperature_2m_max[index],
            temperatureData.temperature_2m_min[index],
        ]),
    ]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `temperature-history-${city}.csv`;
    link.click();
}
