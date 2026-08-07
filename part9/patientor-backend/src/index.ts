import express from 'express';
import cors from 'cors';

import { v1 as uuid } from 'uuid';

import diagnoses from './data/diagnoses';

import patients from './data/patients';
import { NonSensitivePatient, Patient  } from './types';
import { toNewPatient } from './utils';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.json(diagnoses);
});



app.get('/api/patients', (_req, res) => {

  const patientsWithoutSsn: NonSensitivePatient[] = patients.map(
  ({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  })
);

  res.json(patientsWithoutSsn);
});

app.post('/api/patients', (req, res) => {
 try{

   const patient = toNewPatient(req.body);

     const newPatient: Patient = {
      id: uuid(),
      ...patient,
    };
 
  patients.push(newPatient);
  res.json(newPatient);
 } catch (error: unknown) {
   res.status(400).send({
      error: 'Incorrect or missing data',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});