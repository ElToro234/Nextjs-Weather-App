import { fetchWeatherForecast, fetchWeatherInsights, fetchWeatherSummary } from "./app/components/getServerSideProp";


export default async function WeatherPage() {
  // Fetch different types of data concurrently
  const [forecast, summary, insights] = await Promise.all([
    fetchWeatherForecast(),
    fetchWeatherSummary(),
    fetchWeatherInsights()
  ]);

  return (
    <div>
      {/* Render your page using forecast, summary, and insights */}
      <h1>Weather in {summary?.cityName}</h1>
      
      {/* Example of using insights */}
      <div>
        <h2>Weather Insights</h2>
        <p>Average Temperature: {insights?.averageTemperature}°K</p>
        <p>Rainy Days: {insights?.rainyDays}</p>
        <p>Cloud Coverage: {insights?.cloudyCoverage}%</p>
      </div>
    </div>
  );
}