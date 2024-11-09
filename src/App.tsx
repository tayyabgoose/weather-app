import "./App.css";
import { useState } from "react";
import axios from "axios";
import {
  BsSun,
  BsCloudSun,
  BsCloud,
  BsCloudRain,
  BsCloudSnow,
  BsCloudLightningRain,
} from "react-icons/bs";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getBackgroundImage = (weatherCondition: string): string => {
  switch (weatherCondition.toLowerCase()) {
    case "clear":
      return 'url("https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop")';
    case "clouds":
      return 'url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1902&auto=format&fit=crop")';
    case "rain":
      return 'url("https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1940&auto=format&fit=crop")';
    case "snow":
      return 'url("https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1983&auto=format&fit=crop")';
    case "thunderstorm":
      return 'url("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1942&auto=format&fit=crop")';
    case "mist":
      return 'url("https://www.aljazeera.com/wp-content/uploads/2023/11/34247PB-highres-1699528889.jpg?resize=1920%2C1080")';
    default:
      return 'url("https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?q=80&w=1992&auto=format&fit=crop")';
  }
};

function App() {
  interface WeatherData {
    name: string;
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      description: string;
      main: string;
    }>;
  }

  interface ForecastData {
    list: Array<{
      dt: number;
      main: {
        temp: number;
        temp_max: number;
        temp_min: number;
      };
      weather: Array<{
        description: string;
        main: string;
      }>;
    }>;
  }

  interface AirQualityData {
    list: Array<{
      main: {
        aqi: number;
      };
    }>;
  }

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");

      const weatherResponse = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const { lat, lon } = weatherResponse.data.coord;

      const [forecastResponse, airQualityResponse] = await Promise.all([
        axios.get(
          `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
        ),
        axios.get(
          `${BASE_URL}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        ),
      ]);

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
      setAirQuality(airQualityResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Failed to fetch weather data"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  const getWeatherIcon = (condition: string) => {
    const iconSize = 50;
    switch (condition.toLowerCase()) {
      case "clear":
        return (
          <BsSun size={iconSize} className="text-yellow-300 animate-rotate" />
        );
      case "clouds":
        return (
          <BsCloud size={iconSize} className="text-gray-200 animate-float" />
        );
      case "rain":
        return (
          <BsCloudRain size={iconSize} className="text-blue-300 animate-rain" />
        );
      case "snow":
        return (
          <BsCloudSnow size={iconSize} className="text-white animate-rain" />
        );
      case "thunderstorm":
        return (
          <BsCloudLightningRain
            size={iconSize}
            className="text-yellow-300 animate-float"
          />
        );
      default:
        return (
          <BsCloudSun size={iconSize} className="text-gray-300 animate-float" />
        );
    }
  };

  const getAQILabel = (aqi: number) => {
    switch (aqi) {
      case 1:
        return { text: "Good", color: "text-green-200" };
      case 2:
        return { text: "Fair", color: "text-yellow-200" };
      case 3:
        return { text: "Moderate", color: "text-orange-200" };
      case 4:
        return { text: "Poor", color: "text-red-200" };
      case 5:
        return { text: "Very Poor", color: "text-purple-200" };
      default:
        return { text: "Unknown", color: "text-gray-200" };
    }
  };

  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{
        backgroundImage: weather
          ? getBackgroundImage(weather.weather[0].main)
          : getBackgroundImage("default"),
        backgroundColor: "rgba(0,0,0,0.4)",
        backgroundBlendMode: "overlay",
      }}
    >
      <h1 className="text-white text-center text-4xl font-bold pt-6 mb-8">
        Weather App
      </h1>

      <form onSubmit={handleSubmit} className="relative max-w-md mx-auto mb-8">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/30 hover:bg-white/40 rounded-md transition-all duration-200 text-white font-semibold"
        >
          Search
        </button>
      </form>

      {loading && <div className="text-white text-center">Loading...</div>}

      {error && <div className="text-red-200 text-center">{error}</div>}

      {weather && (
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white tracking-wide">
              {weather.name}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              {getWeatherIcon(weather.weather[0].main)}
              <div>
                <p className="text-4xl font-medium text-white">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="text-lg text-white/90 capitalize leading-relaxed">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-8 text-white/90">
              <p className="text-lg">
                H:{" "}
                <span className="font-medium">
                  {Math.round(weather.main.temp_max)}°C
                </span>
              </p>
              <p className="text-lg">
                L:{" "}
                <span className="font-medium">
                  {Math.round(weather.main.temp_min)}°C
                </span>
              </p>
            </div>
            {airQuality && (
              <div className="mt-4">
                <p className="text-lg text-white/90">
                  Air Quality:{"\u00A0"}
                  <span
                    className={`font-medium ${
                      getAQILabel(airQuality.list[0].main.aqi).color
                    }`}
                  >
                    {getAQILabel(airQuality.list[0].main.aqi).text}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {forecast?.list
              .filter((_, index) => index % 8 === 0)
              .slice(0, 4)
              .map((day, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-center transition-transform hover:scale-105"
                >
                  <h3 className="text-lg font-medium text-white mb-3">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </h3>
                  <div className="flex justify-center mb-3">
                    {getWeatherIcon(day.weather[0].main)}
                  </div>
                  <p className="text-2xl font-medium text-white mb-2">
                    {Math.round(day.main.temp)}°C
                  </p>
                  <p className="text-sm text-white/90 capitalize mb-3">
                    {day.weather[0].description}
                  </p>
                  <div className="text-sm text-white/80 space-y-1">
                    <p>H: {Math.round(day.main.temp_max)}°C</p>
                    <p>L: {Math.round(day.main.temp_min)}°C</p>
                  </div>
                  {airQuality && (
                    <div className="mt-2 text-sm">
                      <span
                        className={`${
                          getAQILabel(airQuality.list[index * 8].main.aqi).color
                        }`}
                      >
                        AQI:{" "}
                        {getAQILabel(airQuality.list[index * 8].main.aqi).text}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
