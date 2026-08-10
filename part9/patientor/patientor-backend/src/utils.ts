import { Gender, type Patient, type Entry, type Diagnosis } from "./types";

// ---------- TYPE GUARDS ----------

export const isEntry = (object: unknown): object is Entry => {
  if (!object || typeof object !== "object") {
    return false;
  }

  const entry = object as Entry;

  return (
    entry.type === "Hospital" ||
    entry.type === "OccupationalHealthcare" ||
    entry.type === "HealthCheck"
  );
};

export const isGender = (param: string): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

// ---------- OMIT PARA UNIONES ----------

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

type EntryWithoutId = UnionOmit<Entry, "id">;

// ---------- DIAGNOSIS CODES ----------

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [];
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

// ---------- PATIENT ----------

export const toNewPatient = (object: unknown): Omit<Patient, "id"> => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    !("name" in object) ||
    !("dateOfBirth" in object) ||
    !("ssn" in object) ||
    !("gender" in object) ||
    !("occupation" in object)
  ) {
    throw new Error("Incorrect or missing data");
  }

  if (
    typeof object.name !== "string" ||
    typeof object.dateOfBirth !== "string" ||
    typeof object.ssn !== "string" ||
    typeof object.gender !== "string" ||
    typeof object.occupation !== "string"
  ) {
    throw new Error("Incorrect or missing data");
  }

  if (
    object.name.trim() === "" ||
    object.dateOfBirth.trim() === "" ||
    object.ssn.trim() === "" ||
    object.occupation.trim() === ""
  ) {
    throw new Error("Incorrect or missing data");
  }

  if (!isGender(object.gender)) {
    throw new Error("Incorrect gender");
  }

  return {
    name: object.name,
    dateOfBirth: object.dateOfBirth,
    ssn: object.ssn,
    gender: object.gender,
    occupation: object.occupation,
    entries: [],
  };
};

// ---------- ENTRY ----------

export const toNewEntry = (object: unknown): EntryWithoutId => {
  // Comprobar que es un objeto
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  // Campos comunes a todas las entradas
  if (
    !("description" in object) ||
    !("date" in object) ||
    !("specialist" in object) ||
    !("type" in object)
  ) {
    throw new Error("Incorrect or missing data");
  }

  // Comprobar tipos de los campos comunes
  if (
    typeof object.description !== "string" ||
    typeof object.date !== "string" ||
    typeof object.specialist !== "string" ||
    typeof object.type !== "string"
  ) {
    throw new Error("Incorrect or missing data");
  }

  // Comprobar que no estén vacíos
  if (
    object.description.trim() === "" ||
    object.date.trim() === "" ||
    object.specialist.trim() === ""
  ) {
    throw new Error("Incorrect or missing data");
  }

  // Campos comunes
  const baseEntry = {
    description: object.description,
    date: object.date,
    specialist: object.specialist,
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  // ---------- HEALTH CHECK ----------

  if (object.type === "HealthCheck") {
    if (!("healthCheckRating" in object)) {
      throw new Error("Missing healthCheckRating");
    }

    if (
      typeof object.healthCheckRating !== "number" ||
      ![0, 1, 2, 3].includes(object.healthCheckRating)
    ) {
      throw new Error("Incorrect healthCheckRating");
    }

    return {
      ...baseEntry,
      type: "HealthCheck",
      healthCheckRating: object.healthCheckRating,
    };
  }

  // ---------- HOSPITAL ----------

  if (object.type === "Hospital") {
    if (!("discharge" in object)) {
      throw new Error("Missing discharge");
    }

    if (
      typeof object.discharge !== "object" ||
      object.discharge === null ||
      !("date" in object.discharge) ||
      !("criteria" in object.discharge)
    ) {
      throw new Error("Incorrect discharge");
    }

    if (
      typeof object.discharge.date !== "string" ||
      typeof object.discharge.criteria !== "string"
    ) {
      throw new Error("Incorrect discharge");
    }

    if (
      object.discharge.date.trim() === "" ||
      object.discharge.criteria.trim() === ""
    ) {
      throw new Error("Incorrect discharge");
    }

    return {
      ...baseEntry,
      type: "Hospital",
      discharge: {
        date: object.discharge.date,
        criteria: object.discharge.criteria,
      },
    };
  }

  // ---------- OCCUPATIONAL HEALTHCARE ----------

  if (object.type === "OccupationalHealthcare") {
    if (!("employerName" in object)) {
      throw new Error("Missing employerName");
    }

    if (typeof object.employerName !== "string") {
      throw new Error("Incorrect employerName");
    }

    if (object.employerName.trim() === "") {
      throw new Error("Incorrect employerName");
    }

    // sickLeave es opcional
    if ("sickLeave" in object) {
      if (
        typeof object.sickLeave !== "object" ||
        object.sickLeave === null ||
        !("startDate" in object.sickLeave) ||
        !("endDate" in object.sickLeave)
      ) {
        throw new Error("Incorrect sickLeave");
      }

      if (
        typeof object.sickLeave.startDate !== "string" ||
        typeof object.sickLeave.endDate !== "string"
      ) {
        throw new Error("Incorrect sickLeave");
      }

      if (
        object.sickLeave.startDate.trim() === "" ||
        object.sickLeave.endDate.trim() === ""
      ) {
        throw new Error("Incorrect sickLeave");
      }

      return {
        ...baseEntry,
        type: "OccupationalHealthcare",
        employerName: object.employerName,
        sickLeave: {
          startDate: object.sickLeave.startDate,
          endDate: object.sickLeave.endDate,
        },
      };
    }

    return {
      ...baseEntry,
      type: "OccupationalHealthcare",
      employerName: object.employerName,
    };
  }

  // ---------- TIPO DESCONOCIDO ----------

  throw new Error("Incorrect entry type");
};
