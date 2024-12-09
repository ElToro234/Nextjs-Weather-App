import React from 'react'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails, { WeatherDetailProps } from './WeatherDetails';
import { convertKelvinToCelsius } from '../utils/convertKelvinToCelsius';
import { PiDropSlashBold } from 'react-icons/pi';

export interface ForecastWeatherDetailProps extends WeatherDetailProps{
    weatherIcon: string;
    date: string;
    day: string;
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps){
    const {
        weatherIcon,
        date,
        day,
        temp, 
        feels_like,
        temp_min,
        temp_max,
        description,
    } = props
    
    return (
        <Container className=" gap-4">
            {/* left section */}
            <section className="flex gap-4 items-center px-4">
                <div>
                    <WeatherIcon iconName={weatherIcon}/>
                    <p> {date} </p>
                    <p className="text-sm"> {day} </p>
                </div>

                <div className="flex flex-col px-4">
                    <span className="text-5xl">{convertKelvinToCelsius(temp ?? 0)}°</span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                        <span>Feels like</span>
                        <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
                    </p>
                </div>
                <p className="capitalize"> {description} </p>
            </section>

            {/* right section*/}
            <section className=" overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
                <WeatherDetails {...props}/>
            </section>
        </Container>
    )
}