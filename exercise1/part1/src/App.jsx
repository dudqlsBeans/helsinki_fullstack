import { useState } from 'react'


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  return (
    <div>
      <p>{props.name} {props.count}</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const average = all > 0 ? ((good - bad) / all) : 0
  const positive = all > 0 ? (good / all) : 0

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
      <h1>Statistics</h1>
      {all > 0 ? (
        <div>
          <Statistics name="good" count={good} />
          <Statistics name="neutral" count={neutral} />
          <Statistics name="bad" count={bad} />
          <Statistics name="all" count={all} />
          <Statistics name="average" count={average} />
          <Statistics name="positive" count={positive} />
        </div>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  )
}

export default App