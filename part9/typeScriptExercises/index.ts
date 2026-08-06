import express from "express";
import { calculateBmi } from "./bmiCalculator";

const app = express();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
