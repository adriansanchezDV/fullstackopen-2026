

const Persons = (props) => {

    return   (
    <ul>
        {props.personsToShow.map(person =>
             <li 
             key={person.id}>
                {person.name}: {person.number}
            
            <button onClick={() => props.deletePerson(person.id)}> Delete</button>
                 
            </li>)}
   

      

      
      
    
 </ul>
      )
}

export default Persons