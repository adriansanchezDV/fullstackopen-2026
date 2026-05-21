

import { useState } from 'react'


const Button =({Action, text})=>{
return(
  <button onClick={Action}>
    {text}
  </button>
)
}

const StatisticsLine=(props) =>{
  return(
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics =(props) =>{
  const Average = (props.good - props.bad) / props.all
  const Positive = (props.good / props.all) * 100
  return(
    <div>
      <table>
        <tbody>
          <StatisticsLine text="Good:" value={props.good} />
          <StatisticsLine text="Neutral:" value={props.neutral} />
          <StatisticsLine text="Bad:" value={props.bad} />
          <StatisticsLine text="All:" value={props.all} />
          <StatisticsLine text="Average:" value={Average + '/1'} />
          <StatisticsLine text="Positive:" value={Positive + '%'} />
        </tbody>
      </table>
    </div>
  )
}

const Visualize = (props) =>{
  if(props.all === 0){
    return(
      <p>No feedback given</p>

    )}else{
      return(
        <div>
          
          <Statistics 
          good={props.good}
          neutral={props.neutral} 
          bad={props.bad} 
          all={props.all} 
          
          />
        </div>
      )
    }
  }



const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad 
  
  
 

  return (
    <div>
      <h1>Give feedback</h1>

        <Button Action={() => setGood(good + 1)} text="good" /> 
        <Button Action={() => setNeutral(neutral + 1)} text="neutral" />
        <Button Action={() => setBad(bad + 1)} text="bad" />   
      <h1>Statistics</h1>

      
      <Visualize good={good} neutral={neutral} bad={bad} all={all} />
      

    </div>
  )
}

export default App
