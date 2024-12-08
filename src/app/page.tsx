'use client'

import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import axios from "axios";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherDetail {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export default function Home() {
  const fetchWeatherData = async (): Promise<WeatherData> => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=pure&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    );
    return data;
  };

  const { isLoading, error, data } = useQuery<WeatherData, Error>({
    queryKey: ['repoData'], // Define query key
    queryFn: fetchWeatherData, // Fetch function
  });

  console.log("data", data);

  if (isLoading) return <p>Loading...</p>;
  
  return( 
  <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
    <Navbar/>
  </div> 
  );
}
