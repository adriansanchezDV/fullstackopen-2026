import {
  NewDiaryEntry,
  Weather,
  Visibility
} from './types';

const isWeather = (param: string): param is Weather => {
  return Object.values(Weather).includes(param as Weather);
};

const isVisibility = (param: string): param is Visibility => {
  return Object.values(Visibility).includes(param as Visibility);
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};


const parseComment = (comment: unknown): string => {
  if (!isString(comment)) {
    throw new Error('Incorrect comment: ' + comment);
  }

  return comment;
};


const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};


const parseWeather = (weather: unknown): Weather => {
  if (!isString(weather) || !isWeather(weather)) {
    throw new Error('Incorrect or missing weather: ' + weather);
  }

  return weather;
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!isString(visibility) || !isVisibility(visibility)) {
    throw new Error('Incorrect or missing visibility: ' + visibility);
  }

  return visibility;
};

const isObject = (object: unknown): object is Record<string, unknown> => {
  return typeof object === 'object' && object !== null;
};


const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if (!isObject(object)) {
    throw new Error('Incorrect or missing data');
  }

  if (
    'comment' in object &&
    'date' in object &&
    'weather' in object &&
    'visibility' in object
  ) {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: parseComment(object.comment)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};




export default toNewDiaryEntry;