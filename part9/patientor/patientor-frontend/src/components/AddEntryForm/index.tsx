import { useState, SyntheticEvent } from "react";

import {
  Input,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Button,
} from "@mui/material";

interface Props {
  onSubmit: (values: object) => void;
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const diagnosisOptions = ["Z00.0", "Z57.1", "Z74.3", "M51.2", "S62.5"];

const AddEntryForm = ({ onSubmit }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");

  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");

  const [healthCheckRating, setHealthCheckRating] = useState<number | "">("");

  const [dischargeDate, setDischargeDate] = useState("");

  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const [employerName, setEmployerName] = useState("");

  const [sickLeaveStart, setSickLeaveStart] = useState("");

  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const submit = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      date,
      specialist,
      description,
      diagnosisCodes,
    };

    if (type === "HealthCheck") {
      if (healthCheckRating === "") {
        return;
      }

      onSubmit({
        ...baseEntry,
        type: "HealthCheck",
        healthCheckRating,
      });
    }

    if (type === "Hospital") {
      onSubmit({
        ...baseEntry,
        type: "Hospital",
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria,
        },
      });
    }

    if (type === "OccupationalHealthcare") {
      const entry = {
        ...baseEntry,
        type: "OccupationalHealthcare",
        employerName,
      };

      if (sickLeaveStart || sickLeaveEnd) {
        onSubmit({
          ...entry,
          sickLeave: {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd,
          },
        });
      } else {
        onSubmit(entry);
      }
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Add entry</h3>

      {/* TYPE */}

      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>

        <Select
          value={type}
          label="Type"
          onChange={(event) => setType(event.target.value as EntryType)}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>

          <MenuItem value="Hospital">Hospital</MenuItem>

          <MenuItem value="OccupationalHealthcare">
            Occupational Healthcare
          </MenuItem>
        </Select>
      </FormControl>

      {/* DATE */}

      <div>
        <InputLabel>Date</InputLabel>

        <Input
          type="date"
          fullWidth
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      {/* SPECIALIST */}

      <div>
        <InputLabel>Specialist</InputLabel>

        <Input
          fullWidth
          value={specialist}
          onChange={(event) => setSpecialist(event.target.value)}
        />
      </div>

      {/* DESCRIPTION */}

      <div>
        <InputLabel>Description</InputLabel>

        <Input
          fullWidth
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      {/* DIAGNOSIS CODES */}

      <FormControl fullWidth margin="normal">
        <InputLabel>Diagnosis codes</InputLabel>

        <Select
          multiple
          value={diagnosisCodes}
          onChange={(event) =>
            setDiagnosisCodes(
              typeof event.target.value === "string"
                ? event.target.value.split(",")
                : event.target.value,
            )
          }
          renderValue={(selected) => selected.join(", ")}
        >
          {diagnosisOptions.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* HEALTH CHECK */}

      {type === "HealthCheck" && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Health check rating</InputLabel>

          <Select
            value={healthCheckRating}
            label="Health check rating"
            onChange={(event) =>
              setHealthCheckRating(
                event.target.value === "" ? "" : Number(event.target.value),
              )
            }
          >
            <MenuItem value={0}>0 - Healthy</MenuItem>

            <MenuItem value={1}>1 - Low Risk</MenuItem>

            <MenuItem value={2}>2 - High Risk</MenuItem>

            <MenuItem value={3}>3 - Critical Risk</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* HOSPITAL */}

      {type === "Hospital" && (
        <>
          <div>
            <InputLabel>Discharge date</InputLabel>

            <Input
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={(event) => setDischargeDate(event.target.value)}
            />
          </div>

          <div>
            <InputLabel>Discharge criteria</InputLabel>

            <Input
              fullWidth
              value={dischargeCriteria}
              onChange={(event) => setDischargeCriteria(event.target.value)}
            />
          </div>
        </>
      )}

      {/* OCCUPATIONAL HEALTHCARE */}

      {type === "OccupationalHealthcare" && (
        <>
          <div>
            <InputLabel>Employer name</InputLabel>

            <Input
              fullWidth
              value={employerName}
              onChange={(event) => setEmployerName(event.target.value)}
            />
          </div>

          <div>
            <InputLabel>Sick leave start</InputLabel>

            <Input
              type="date"
              fullWidth
              value={sickLeaveStart}
              onChange={(event) => setSickLeaveStart(event.target.value)}
            />
          </div>

          <div>
            <InputLabel>Sick leave end</InputLabel>

            <Input
              type="date"
              fullWidth
              value={sickLeaveEnd}
              onChange={(event) => setSickLeaveEnd(event.target.value)}
            />
          </div>
        </>
      )}

      <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
        Add entry
      </Button>
    </form>
  );
};

export default AddEntryForm;
