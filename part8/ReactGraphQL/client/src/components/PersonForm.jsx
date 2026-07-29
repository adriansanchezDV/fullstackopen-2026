import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { CREATE_PERSON, ALL_PERSONS } from "../queries";

const PersonForm = ({ setError }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [
      {
        query: ALL_PERSONS,
      },
    ],

    onError: (error) => {
      const message = error.message;

      console.log("MENSAJE QUE ENVIO A APP:", message);

      setError(message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    try {
      await createPerson({
        variables: {
          name,
          phone,
          street,
          city,
        },
      });

      setName("");
      setPhone("");
      setStreet("");
      setCity("");
    } catch (error) {
      // El error ya lo controla onError
    }
  };

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={submit}>
        <div>
          name:
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          phone:
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div>
          street:
          <input
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />
        </div>

        <div>
          city:
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>

        <button type="submit">add!</button>
      </form>
    </div>
  );
};

export default PersonForm;
