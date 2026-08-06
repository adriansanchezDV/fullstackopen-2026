interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyHours: number[],
  target: number
): Result => {
  const periodLength = dailyHours.length;

  const trainingDays = dailyHours.filter(day => day > 0).length;

  const totalHours = dailyHours.reduce(
    (sum, current) => sum + current,
    0
  );

  const average = totalHours / periodLength;

  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average < target * 0.5) {
    rating = 1;
    ratingDescription = "you need to exercise much more";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "great job, target achieved";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    throw new Error(
      "Usage: npm run calculateExercises <target> <day1> <day2> ..."
    );
  }

  const target = Number(args[0]);
  const dailyHours = args.slice(1).map(Number);

  if (isNaN(target) || dailyHours.some(hour => isNaN(hour))) {
    throw new Error("Provided values were not numbers!");
  }

  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Error:", error.message);
  } else {
    console.log("Unknown error");
  }
}