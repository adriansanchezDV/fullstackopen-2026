import { type TotalProps } from '../types';

const Total = ({ totalExercises }: TotalProps) => {
  return (
    <p>
      Number of exercises {totalExercises}
    </p>
  );
};

export default Total;