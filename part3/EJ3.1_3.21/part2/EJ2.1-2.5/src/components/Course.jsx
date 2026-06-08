

const Course = (props) => {
  return (
    <div>

      <Header course={props.course} />
      <Content course={props.course} />
      <Total course={props.course} />
      
      
    </div>
  )
}

const Header = ({ course }) => {
  return (
    
      <h1>{course.name}</h1>
    
  )
}

const Content = ({ course }) => {

  return (
    <div>

      <ul> 

        {course.parts.map(part => 
        <li key={part.id}>
          {part.name}: {part.exercises}
          </li>)}


      </ul>
    </div>
  )

}


const Total = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <p>Total number of exercises: {total}</p>
    </div>
  )
}


export default Course