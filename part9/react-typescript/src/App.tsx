import Content, { type CoursePart } from './components/Content';
import Header, { type Props } from './components/Header';
import Total from './components/Total';





const courseName: Props = { name: "Half Stack application development" };

const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);


const App = () => {
 

  return (
    <div>
      <Header name={courseName.name} />
      <Content parts={courseParts} />
      <Total  totalExercises={totalExercises}/>
    </div>
  );
};

export default App;