import WeatherInfo from './WeatherInfo'

const CountryDetail = ({ country }) => (
  <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">{country.name.common}</h1>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="mb-2">
          <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Area:</strong> {country.area?.toLocaleString() || 'N/A'} km²
        </div>
        <div className="mb-2">
          <strong>Population:</strong> {country.population?.toLocaleString() || 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Languages:</strong>
          <ul className="list-disc list-inside ml-4">
            {country.languages
              ? Object.values(country.languages).map((lang, i) => <li key={i}>{lang}</li>)
              : <li>N/A</li>}
          </ul>
        </div>
        <WeatherInfo capital={country.capital?.[0]} />
      </div>

      <div className="text-center">
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-48 h-auto border rounded shadow mb-2"
        />
      </div>
    </div>
  </div>
)

export default CountryDetail
