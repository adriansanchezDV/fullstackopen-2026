import {
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from "../../../types";

interface Props {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;

    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;

    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;

    default:
      return assertNever(entry);
  }
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div>
      <p>🏥 Hospital</p>

      <p>
        <strong>Discharge:</strong>
      </p>

      <p>Date: {entry.discharge.date}</p>
      <p>Criteria: {entry.discharge.criteria}</p>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <div>
      <p>👷 Occupational Healthcare</p>

      <p>
        <strong>Employer:</strong> {entry.employerName}
      </p>

      {entry.sickLeave && (
        <>
          <p>
            <strong>Sick leave:</strong>
          </p>

          <p>Start: {entry.sickLeave.startDate}</p>
          <p>End: {entry.sickLeave.endDate}</p>
        </>
      )}
    </div>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <div>
      <p>❤️ Health Check</p>

      <p>
        <strong>Health rating:</strong> {entry.healthCheckRating}
      </p>
    </div>
  );
};

export default EntryDetails;
