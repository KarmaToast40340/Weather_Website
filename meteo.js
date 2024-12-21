// Fonction pour afficher les données météo avec la nouvelle fonction displayWeather
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

// Fonction pour initialiser le processus
function init() {
    const svg = document.getElementById("france-map");
    const coordinatesDisplay = document.getElementById("coordinates");

    // Vérifier si l'élément SVG est bien trouvé
    if (!svg) {
        console.error("Image SVG de la carte de la France non trouvée");
        return;
    }

    // Limites géographiques de la France
    const geoBounds = {
        north: 51.089062,  // Latitude nord
        south: 41.342327,  // Latitude sud
        west: -5.142222,   // Longitude ouest
        east: 9.561556     // Longitude est
    };

    // Dimensions de l'image SVG
    const svgWidth = 800;
    const svgHeight = 700;

    // Conversion des coordonnées SVG en latitude/longitude
    function svgToGeo(svgX, svgY) {
        const longitude = geoBounds.west + (svgX / svgWidth) * (geoBounds.east - geoBounds.west);
        const latitude = geoBounds.north - (svgY / svgHeight) * (geoBounds.north - geoBounds.south);
        return { latitude, longitude };
    }

    // Gestion du clic sur la carte
    svg.addEventListener("click", (event) => {
        const svgRect = svg.getBoundingClientRect();
        const svgX = event.clientX - svgRect.left;
        const svgY = event.clientY - svgRect.top;

        const { latitude, longitude } = svgToGeo(svgX, svgY);
        
        // Récupérer les données météo pour les coordonnées
        loadWeather(latitude, longitude);
    });

    // Fonction pour récupérer les données météo via l'API
    async function loadWeather(lat, lon) {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
            const data = await response.json();

            if (data.current_weather) {
                const weather = data.current_weather;
                // Affichage de la météo en utilisant la nouvelle fonction displayWeather
                displayWeather(`Coordonnées géographiques (${lat.toFixed(5)}, ${lon.toFixed(5)})`, weather);
            } else {
                displayWeather("Inconnu", null);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données météo :", error);
            displayWeather("Erreur", null);
        }
    }

    // Recherche d'une ville et récupération des données météo
    const city = document.querySelector("#site-search").value.trim();

    if (city) {
        fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(city)}`)
            .then(response => response.json())
            .then(data => {
                if (!data.features || data.features.length === 0) {
                    alert("Ville non trouvée !");
                    return;
                }

                const [longitude, latitude] = data.features[0].geometry.coordinates;

                // Récupérer les données météo pour la ville
                return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Paris`);
            })
            .then(response => response.json())
            .then(weatherData => {
                if (!weatherData.current_weather) {
                    alert("Aucune donnée météo disponible !");
                    return;
                }

                // Affichage de la météo en utilisant la nouvelle fonction displayWeather
                displayWeather(city, weatherData.current_weather);
            })
            .catch(error => {
                console.error("Erreur :", error.message);
                alert("Une erreur est survenue. Vérifiez la console pour plus de détails.");
            });
    }
}

// Initialisation lorsque le DOM est entièrement chargé
document.addEventListener("DOMContentLoaded", init);
