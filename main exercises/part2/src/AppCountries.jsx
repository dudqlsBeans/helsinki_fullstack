import { useState, useEffect } from 'react'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setInitialLoading(true)
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch countries data')
        }
        return response.json()
      })
      .then(data => {
        setAllCountries(data)
      })
      .catch(err => {
        setError('Error fetching country data. Please try again.')
        console.error('Error:', err)
      })
      .finally(() => {
        setInitialLoading(false)
      })
  }, [])

  useEffect(() => {
    if (query === '') {
      setCountries([])
      setSelectedCountry(null)
      setError('')
      return
    }

    if (allCountries.length === 0) return

    const timeoutId = setTimeout(() => {
      setLoading(true)

      const filtered = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )
      setCountries(filtered)

      if (filtered.length === 1 && (!selectedCountry || selectedCountry.name.common !== filtered[0].name.common)) {
        setSelectedCountry(filtered[0])
      } else if (filtered.length !== 1 && !filtered.find(c => c.name.common === selectedCountry?.name.common)) {
        setSelectedCountry(null)
      }

      setLoading(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, allCountries, selectedCountry])

  const handleShow = (countryName) => {
    const country = countries.find(c => c.name.common === countryName)
    if (country) {
      setSelectedCountry(country)
      setQuery(countryName)
    }
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="main-heading">Country Information</h1>
          <p className="subheading">Search for countries to view detailed information</p>
        </div>

        <div className="search-box">
          <label className="search-label">
            Find countries:
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type country name..."
            className="search-input"
          />
        </div>

        {initialLoading && (
          <div className="loading-section">
            <div className="spinner"></div>
          </div>
        )}

        {loading && !initialLoading && (
          <div className="loading-section small">
            <div className="spinner small"></div>
            <p className="loading-text small">Searching...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <p className="error-text">{error}</p>
          </div>
        )}

        {!loading && !initialLoading && countries.length > 10 && (
          <div className="warning-box">
            <p className="warning-text">
              Too many matches ({countries.length} found), specify another filter
            </p>
          </div>
        )}

        {!loading && !initialLoading && countries.length <= 10 && countries.length > 1 && (
          <div className="country-list-box">
            <div className="country-list-header">
              <h2 className="country-list-title">
                Countries found ({countries.length}):
              </h2>
            </div>
            <CountryList countries={countries} onShow={handleShow} />
          </div>
        )}

        {!loading && !initialLoading && selectedCountry && (
          <CountryDetail country={selectedCountry} />
        )}

        {!loading && !initialLoading && query !== '' && countries.length === 0 && !error && (
          <div className="no-results-box">
            <p className="no-results-text">No countries found matching "{query}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App