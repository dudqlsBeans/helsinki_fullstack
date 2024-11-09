import { useState } from 'react'


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = good / all

  const setToGood = newValue => {
    console.log('good value now', newValue)
    setGood(newValue)
  }

  const setToNeutral = newValue => {
    console.log('neutral value now', newValue)
    setNeutral(newValue)
  }

  const setToBad = newValue => {
    console.log('bad value now', newValue)
    setBad(newValue)
  }


  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {all}</p>
      <p>average {average}</p>
      <p>positive {positive}</p>
    </div>
  )
}

export default App