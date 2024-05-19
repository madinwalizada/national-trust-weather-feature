// Function to fetch weather data from the provided URL
async function fetchWeather() {
    try {
        console.log('Fetching weather data...');
        const response = await fetch('https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=27.987850&lon=86.925026');

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Weather data fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to render weather information on the page
async function renderWeather() {
    try {
        console.log('Rendering weather data...');
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
                const weatherDescription = firstForecast.weather[0].main;
                const date = new Date(firstForecast.dt * 1000);
                const dateString = `${date.toLocaleString('en-GB', { month: 'short' })}-${date.getDate()}-${date.getFullYear()}`;
                const weatherIcon = firstForecast.weather[0].icon;
                const visibility = firstForecast.visibility;
                const humidity = firstForecast.main.humidity;
                const windSpeedMilesPerHour = firstForecast.wind.speed * 2.237;

                // Construct HTML for weather information
                const weatherInfoHTML = `
                    <h2>Weather Information</h2>
                    <p class="iIiUuX">${dateString}</p>
                    <div>
                        <h3><img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">${currentTemp.toFixed(2)}°C &nbsp;&nbsp; | &nbsp;&nbsp; ${weatherDescription}</h3>
                        <p class="nsps">High: ${highTemp.toFixed(2)}°C &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; Low: ${lowTemp.toFixed(2)}°C</p>
                        <p class="nsps">Visibility: ${visibility} meters &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; Humidity: ${humidity}%</p>
                    </div>
                    <p class="nsps">Wind Speed: ${windSpeedMilesPerHour.toFixed(2)} mph</p>
                `;

                // Insert weather information into the page
                console.log('Inserting weather information into the page...');
                summaryLinks.parentElement.insertAdjacentHTML('afterend', weatherInfoHTML);
                console.log('Weather information rendered successfully.');
            } else {
                console.error('Summary links ul element not found.');
            }
        } else {
            console.error('Failed to fetch weather data or data structure is incorrect.');
        }
    } catch (error) {
        console.error('Error rendering weather data:', error);
    }
}

// Call the renderWeather function to display the weather information
renderWeather().then(() => {
    console.log('renderWeather function executed successfully.');
}).catch(error => {
    console.error('Error executing renderWeather function:', error);
});
