import { useEffect, useState } from "react";
import axios from "axios";
import NewDiaryForm from "./components/NewDiaryForm";
import { type DiaryEntry, type NewDiaryEntry } from "./types";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<DiaryEntry[]>("http://localhost:3000/api/diaries")
      .then((response) => {
        setDiaries(response.data);
      });
  }, []);

  const addDiary = (diary: NewDiaryEntry) => {
    axios
      .post<DiaryEntry>("http://localhost:3000/api/diaries", diary)
      .then((response) => {
        setDiaries(diaries.concat(response.data));
        setError("");
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data || "Unknown error");
        } else {
          setError("Unknown error");
        }
      });
  };

  return (
    <div>
      <h1>Flight Diary</h1>

      {error && (
        <div>
          <strong>{error}</strong>
        </div>
      )}

      <NewDiaryForm onAddDiary={addDiary} />

      <h2>Entries</h2>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>

          <p>Weather: {diary.weather}</p>

          <p>Visibility: {diary.visibility}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
