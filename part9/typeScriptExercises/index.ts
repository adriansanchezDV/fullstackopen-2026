import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  const heightNumber = Number(height);
  const weightNumber = Number(weight);

  if (isNaN(heightNumber) || isNaN(weightNumber)) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  const bmi = calculateBmi(heightNumber, weightNumber);

  return res.json({
    weight: weightNumber,
    height: heightNumber,
    bmi
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    return res.status(400).json({
      error: "parameters missing"
    });
  }

  if (
    !Array.isArray(daily_exercises) ||
    typeof target !== "number"
  ) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  if (
    daily_exercises.some(
      (exercise: unknown) => typeof exercise !== "number"
    )
  ) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  const result = calculateExercises(
    daily_exercises,
    target
  );

  return res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
