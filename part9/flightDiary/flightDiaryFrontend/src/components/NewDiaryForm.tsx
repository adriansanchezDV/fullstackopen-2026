import { useState } from "react";
import { type NewDiaryEntry, type Weather, type Visibility } from "../types";

interface Props {
  onAddDiary: (diary: NewDiaryEntry) => void;
}

const weatherOptions: Weather[] = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy",
];

const visibilityOptions: Visibility[] = ["great", "good", "ok", "poor"];

const NewDiaryForm = ({ onAddDiary }: Props) => {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [visibility, setVisibility] = useState<Visibility>("great");
  const [comment, setComment] = useState("");

  const submitDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newDiary: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    onAddDiary(newDiary);

    setDate("");
    setWeather("sunny");
    setVisibility("great");
    setComment("");
  };

  return (
    <div>
      <h2>Add new entry</h2>

      <form onSubmit={submitDiary}>
        <div>
          <label htmlFor="date">Date:</label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <fieldset>
          <legend>Weather</legend>

          {weatherOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Visibility</legend>

          {visibilityOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>

        <div>
          <label htmlFor="comment">Comment:</label>

          <input
            id="comment"
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewDiaryForm;
