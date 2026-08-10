import Part from './Part';
import { type CoursePart } from '../types';

type ContentProps = {
  parts: CoursePart[];
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
  );
};

export default Content;