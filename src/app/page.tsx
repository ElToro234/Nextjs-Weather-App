'use client'

import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./components/Container";
import { convertKelvinToCelsius } from "./utils/convertKelvinToCelsius";
import WeatherIcon from "./components/WeatherIcon";
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import WeatherDetails from "./components/WeatherDetails";
import { metersToKm } from "./utils/metersToKm";
import { convertWindSpeed } from "./utils/convertWindSpeed";

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
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
            <p>{format(parseISO(firstData?.dt_txt ??''), "EEEE")}</p>
            <p className="text-lg">{format(parseISO(firstData?.dt_txt ??''), "(dd.MM.yyyy)")}</p>
          </h2>

          <Container className="gap-10 px-6 items-center">
            {/* temperature */}
            <div className="flex flex-col px-4">

              <span className="text-5xl">
                {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}
              </span>

              <p className="text-xs space-x-1 whitespace-nowrap">
                <span>Feels like</span>
                <span>
                  {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}
                </span>
              </p>

              <p className="text-xs space-x-2">
                <span>
                  {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                  °↓{" "}
                  </span>
                <span>
                  {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                  °↑{" "}
                  </span>
              </p>
            </div>

            {/* Time and weather data */}
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {data?.list.map((d, i)=>
                <div 
                  key={i}
                  className="flex flex-col justify-between gap-2 items-center text-xs 
                  font-semibold"
                >
                  <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a")}</p>
                  
                  {/* <WeatherIcon iconName={d.weather[0].icon}/> */}
                  <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}/>
                  <p >{convertKelvinToCelsius(d?.main.temp ?? 0)}</p>
                </div>
              )}
            </div>
          </Container>
        </div>
        <div className="flex gap-4">
          {/* left */}
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <p>{firstData?.weather[0].description}</p>
            <WeatherIcon iconName={getDayOrNightIcon(
              firstData?.weather[0].icon ?? "",
              firstData?.dt_txt ?? "")}/>
          </Container>
          
          <Container className="bg-yellow-300/80 px-6 gap-4 justify-between
          overflow-x-auto">
            <WeatherDetails 
              visability={metersToKm(firstData?.visibility ?? 10000) } 
              airPressure={ `${firstData?.main.pressure} hPa`}
              humidity= {`${firstData?.main.humidity}%`}
              sunrise= {format(fromUnixTime(data?.city.sunrise ?? 1702949452 ), "H:mm")}
              sunset= {format(fromUnixTime(data?.city.sunset ?? 1702949452 ), "H:mm")}
              windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
          </Container>

          {/* right */}
        </div>
      </section>

      {/* 7 days data */}
      <section className="flex w-full flex-col gap-4">
        <p className="text-2xl">Forecast (7 days) </p>
      </section>
    </main>
  </div> 
  );
}
