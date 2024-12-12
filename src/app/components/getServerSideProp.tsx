import axios from 'axios';

// Function to fetch weather forecast data
export async function fetchWeatherForecast(place: string = 'Montreal') {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`
    );
    return data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
}

// Function to fetch additional weather-related data
export async function fetchWeatherSummary(place: string = 'Montreal') {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

  try {
    const currentWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${API_KEY}`
    );
    
    const currentData = currentWeatherResponse.data;

    return {
      temperature: {
        current: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        min: currentData.main.temp_min,
        max: currentData.main.temp_max,
      },
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      cityName: currentData.name,
      country: currentData.sys.country,
    };
  } catch (error) {
    console.error('Error fetching weather summary:', error);
    return null;
  }
}

export async function fetchWeatherInsights(place: string = 'Montreal') {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

  try {
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56}`
    );

    const forecastData = forecastResponse.data;

    // Calculate insights
    const temperatureData = forecastData.list.map((item: any) => item.main.temp);
    const humidityData = forecastData.list.map((item: any) => item.main.humidity);

    return {
      averageTemperature: calculateAverage(temperatureData),
      maxTemperature: Math.max(...temperatureData),
      minTemperature: Math.min(...temperatureData),
      averageHumidity: calculateAverage(humidityData),
      rainyDays: forecastData.list.filter((item: any) => 
        item.weather[0].main.toLowerCase().includes('rain')
      ).length,
      cloudyCoverage: calculateAverage(
        forecastData.list.map((item: any) => item.clouds.all)
      )
    };
  } catch (error) {
    console.error('Error fetching weather insights:', error);
    return null;
  }
}

// Utility function to calculate average
function calculateAverage(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  