export interface WeatherSnapshot {
  temperatura: number | null;
}

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const DEFAULT_LATITUDE = 28.4853;
const DEFAULT_LONGITUDE = -16.3197;

export const getCurrentWeather = async (): Promise<WeatherSnapshot> => {
  try {
    const url = `${WEATHER_BASE_URL}?latitude=${DEFAULT_LATITUDE}&longitude=${DEFAULT_LONGITUDE}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) {
      return { temperatura: null };
    }

    const data = (await response.json()) as {
      current_weather?: { temperature?: number };
    };

    const rawTemp = data.current_weather?.temperature;
    if (typeof rawTemp !== "number" || Number.isNaN(rawTemp)) {
      return { temperatura: null };
    }

    return { temperatura: Math.round(rawTemp) };
  } catch {
    return { temperatura: null };
  }
};
