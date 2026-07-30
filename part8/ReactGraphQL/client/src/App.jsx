import React, { useState, useEffect } from "react";

import Persons from "./components/Person";
import PersonForm from "./components/PersonForm";
import Notify from "./components/Notify";
import PhoneForm from "./components/PhoneForm";
import LoginForm from "./components/LoginForm";

import { ALL_PERSONS } from "./queries";

import { useApolloClient } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);

  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("phonenumbers-user-token");

    if (token) {
      setToken(token);
    }
  }, []);

  const result = useQuery(ALL_PERSONS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />

        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <Persons persons={result.data.allPersons} />

      <PersonForm setError={notify} />

      <PhoneForm setError={notify} />

      <button onClick={logout}>logout</button>
    </div>
  );
};
export default App;
