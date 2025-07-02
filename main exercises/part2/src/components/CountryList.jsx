const CountryList = ({ countries, onShow }) => (
    <div className="mt-4">
      {countries.map(country => (
        <div key={country.name.common} className="flex items-center justify-between py-2 px-3 border-b border-gray-200">
          <span className="font-medium">{country.name.common}</span>
          <button
            onClick={() => onShow(country.name.common)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            show
          </button>
        </div>
      ))}
    </div>
  )
  
  export default CountryList
  