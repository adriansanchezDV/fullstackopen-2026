import { Gender, type Patient } from './types';

export const isGender = (param: string): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

export const toNewPatient = (object: unknown): Omit<Patient, 'id'> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    !('name' in object) ||
    !('dateOfBirth' in object) ||
    !('ssn' in object) ||
    !('gender' in object) ||
    !('occupation' in object)
  ) {
    throw new Error('Incorrect or missing data');
  }

  if (
    typeof object.name !== 'string' ||
    typeof object.dateOfBirth !== 'string' ||
    typeof object.ssn !== 'string' ||
    typeof object.gender !== 'string' ||
    typeof object.occupation !== 'string'
  ) {
    throw new Error('Incorrect or missing data');
  }

  if (!isGender(object.gender)) {
    throw new Error('Incorrect gender');
  }

  return {
    name: object.name,
    dateOfBirth: object.dateOfBirth,
    ssn: object.ssn,
    gender: object.gender,
    occupation: object.occupation,
  };
};