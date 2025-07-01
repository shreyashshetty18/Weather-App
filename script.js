
lucide.createIcons();

const API_KEY = 'your_api_key';
const weatherApiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather-display');


async function fetchWeatherData(city) {
    weatherDisplay.innerHTML = `<p class="loading flex items-center gap-2"><i data-lucide="loader" class="animate-spin"></i> Loading weather...</p>`;
    lucide.createIcons();

    const url = `${weatherApiBaseUrl}?q=${city}&appid=${API_KEY}&units=metric`; // units=metric for Celsius

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            
            displayError(data.message || 'City not found or API error.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError('Could not fetch weather data. Please try again.');
    }
}

function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const temperature = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const description = weather[0].description;
    const humidity = main.humidity;
    const windSpeed = (wind.speed * 3.6).toFixed(1);
    const iconCode = weather[0].icon; 
    const weatherIcon = getWeatherIcon(iconCode);

    weatherDisplay.innerHTML = `
        <h2 class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-6 h-6 text-indigo-600"></i>
            ${name}, ${sys.country}
        </h2>
        <div class="temperature">
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}" class="icon">
            ${temperature}°C
        </div>
        <p class="description">${description}</p>
        <div class="weather-details">
            <div class="detail-item">
                <i data-lucide="thermometer" class="w-5 h-5 text-gray-700"></i>
                Feels Like: <span>${feelsLike}°C</span>
            </div>
            <div class="detail-item">
                <i data-lucide="droplet" class="w-5 h-5 text-gray-700"></i>
                Humidity: <span>${humidity}%</span>
            </div>
            <div class="detail-item">
                <i data-lucide="wind" class="w-5 h-5 text-gray-700"></i>
                Wind: <span>${windSpeed} km/h</span>
            </div>
        </div>
    `;
    lucide.createIcons(); 
}

function getWeatherIcon(iconCode) {
    if (iconCode.includes('01')) return 'sun'; // Clear sky
    if (iconCode.includes('02')) return 'cloud-sun'; // Few clouds
    if (iconCode.includes('03')) return 'cloud'; // Scattered clouds
    if (iconCode.includes('04')) return 'cloud-fog'; // Broken clouds
    if (iconCode.includes('09')) return 'cloud-rain'; // Shower rain
    if (iconCode.includes('10')) return 'cloud-drizzle'; // Rain
    if (iconCode.includes('11')) return 'cloud-lightning'; // Thunderstorm
    if (iconCode.includes('13')) return 'cloud-snow'; // Snow
    if (iconCode.includes('50')) return 'cloud-fog'; // Mist
    return 'thermometer'; // Default icon
}

function displayError(message) {
    weatherDisplay.innerHTML = `<p class="error-message flex items-center gap-2"><i data-lucide="alert-triangle"></i> ${message}</p>`;
    lucide.createIcons(); 
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        displayError('Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

