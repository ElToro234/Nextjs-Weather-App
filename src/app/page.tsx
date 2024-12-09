'use client'

import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Container from "./components/Container";
import { convertKelvinToCelsius } from "./utils/convertKelvinToCelsius";

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
      `https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    );
    return data;
  };

  const { isLoading, error, data } = useQuery<WeatherData, Error>({
    queryKey: ['repoData'], // Define query key
    queryFn: fetchWeatherData, // Fetch function
  }
);

const firstData = data?.list[0];

  console.log("data", data);

  if (isLoading) 
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
    
  return( 
  <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
    <Navbar/>

    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
      {/* Todays data */}
      <section>

        <div>
          <h2 className="flex gap-1 text-2xl items-end">
            <p>{format(parseISO(firstData?.dt_txt ??''), 'EEEE')}</p>
            <p className="text-lg">{format(parseISO(firstData?.dt_txt ??''), 'dd.MM.yyyy')}</p>
          </h2>

          <Container className="gap-10 px-6 items-center">
            <div className="flex flex-col px-4">
              {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
            </div>
          </Container>
        </div>

      </section>

      {/* 7 days data */}
      <section>
        
      </section>
    </main>
  </div> 
  );
}
