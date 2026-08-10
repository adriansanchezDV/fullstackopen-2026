import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";

import patientService from "../../services/patients";
import { Diagnosis, Patient } from "../../types";

import AddEntryForm from "../AddEntryForm";
import EntryDetails from "./EntryDetails";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        return;
      }

      try {
        const patient = await patientService.getById(id);
        setPatient(patient);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          setError(e.response?.data?.error ?? "Could not fetch patient");
        } else {
          setError("Could not fetch patient");
        }
      }
    };

    void fetchPatient();
  }, [id]);

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find((diagnosis) => diagnosis.code === code);

    return diagnosis ? diagnosis.name : "Unknown diagnosis";
  };

  const submitNewEntry = async (values: object) => {
    if (!id || !patient) {
      return;
    }

    // Quitamos el error anterior antes de hacer el POST
    setError(undefined);

    try {
      const newEntry = await patientService.createEntry(id, values);

      // Solo llegamos aquí si el backend respondió correctamente
      console.log("BACKEND ACCEPTED:", newEntry);

      setPatient({
        ...patient,
        entries: patient.entries.concat(newEntry),
      });
    } catch (e: unknown) {
      console.log("BACKEND REJECTED:", e);

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4">{patient.name}</Typography>

      <p>
        <strong>SSN:</strong> {patient.ssn}
      </p>

      <p>
        <strong>Date of birth:</strong> {patient.dateOfBirth}
      </p>

      <p>
        <strong>Occupation:</strong> {patient.occupation}
      </p>

      <p>
        <strong>Gender:</strong> {patient.gender}
      </p>

      <Typography variant="h5">Add new entry</Typography>

      <AddEntryForm onSubmit={submitNewEntry} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Typography variant="h5" sx={{ marginTop: 3 }}>
        Entries
      </Typography>

      {patient.entries.map((entry) => (
        <div key={entry.id}>
          <p>
            <strong>Date:</strong> {entry.date}
          </p>

          <p>
            <strong>Description:</strong> {entry.description}
          </p>

          <EntryDetails entry={entry} />

          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map((code) => (
                <li key={code}>
                  {code}: {getDiagnosisName(code)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
