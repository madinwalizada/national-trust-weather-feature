// Function to fetch weather data from the provided URL
async function fetchWeather() {
    try {
        // Check if weather data is already in LocalStorage
        const cachedWeatherData = localStorage.getItem('weatherData');
        if (cachedWeatherData) {
            return JSON.parse(cachedWeatherData);
        }

        const response = await fetch('https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=27.987850&lon=86.925026');
        const data = await response.json();

        // Cache the fetched data in LocalStorage
        localStorage.setItem('weatherData', JSON.stringify(data));

        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to render weather information on the page
async function renderWeather() {
    const weatherData = await fetchWeather();

    if (weatherData && weatherData.list && weatherData.list.length > 0) {
        // Select the ul element containing the three li items
        const summaryLinks = document.querySelector('.Placestyle__StyledPlaceSummaryLinks-sc-7yy3d-8.evLkd ul');

        // Check if the ul element exists
        if (summaryLinks) {
            // Extract necessary weather information
            const firstForecast = weatherData.list[0];
            const currentTemp = firstForecast.main.temp;
            const highTemp = firstForecast.main.temp_max;
            const lowTemp = firstForecast.main.temp_min;
            const weatherDescription = firstForecast.weather[0].description;
            const dateTimeString = firstForecast.dt_txt;
            // Parse the date string to extract the date part in UK format
            const date = new Date(dateTimeString);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            const dateString = date.toLocaleDateString('en-GB', options); // UK Format: "Day Month Year"
            const weatherIcon = firstForecast.weather[0].icon;
            const humidity = firstForecast.main.humidity;
            const windSpeedMetersPerSecond = firstForecast.wind.speed;
            const visibility = firstForecast.visibility;

            // Convert wind speed from meters per second to miles per hour
            const windSpeedMilesPerHour = (windSpeedMetersPerSecond * 2.23694).toFixed(2);

            // Construct HTML for weather information on the page
            const weatherInfoHTML = `
                <h2>Weather Information</h2>
                <p class="iIiUuX">${dateString}</p>
                <div>
                    <h3><img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">${currentTemp.toFixed(2)}°C &nbsp;&nbsp; | &nbsp;&nbsp; ${weatherDescription}</h3>
                    <p class="nsps">High: ${highTemp.toFixed(2)}°C &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; Low: ${lowTemp.toFixed(2)}°C</p>
                    <p class="nsps">Visibility: ${visibility} meters &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; Humidity: ${humidity}%</p>
                </div>
                <p class="nsps">Wind Speed: ${windSpeedMilesPerHour} mph</p>
            `;

            // Insert weather information after the ul element
            summaryLinks.insertAdjacentHTML('afterend', weatherInfoHTML);

        } else {
            console.error('Summary links ul element not found.');
        }
    } else {
        console.error('Failed to fetch weather data or data structure is incorrect.');
    }
}

// Call the renderWeather function to display the weather information on the National Trust page!
renderWeather();
