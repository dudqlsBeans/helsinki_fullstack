import { useState, useEffect } from 'react'

const WeatherInfo = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!capital) return

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
    if (!API_KEY) {
      setError('Missing weather API key.')
      return
    }

    setLoading(true)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        setWeather({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 10) / 10
        })
      })
      .catch(() => setError('Failed to fetch weather.'))
      .finally(() => setLoading(false))
  }, [capital])

  if (!capital) return null

  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-gray-700 mb-3">Weather in {capital}</h3>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {weather && (
        <div className="flex space-x-4 items-center">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.condition}
            className="w-16 h-16"
          />
          <div className="text-sm space-y-1">
            <div>🌡️ {weather.temperature}°C</div>
            <div>💨 {weather.windSpeed} m/s</div>
            <div>💧 {weather.humidity}%</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherInfo
