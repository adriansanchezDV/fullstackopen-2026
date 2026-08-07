
  
export type CoursePart = {
    name: string;
    exerciseCount: number;
  };

 


  const Content =(props: { parts: CoursePart[] })=>{
    return(
        <div>
            {props.parts.map((part, index) => (
                <p key={index}>
                    {part.name} {part.exerciseCount}
                </p>
            ))}
      </div>
    )
  }

  export default Content;