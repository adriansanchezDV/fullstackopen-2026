import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import Select from "react-select";

const EditAuthor = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const { data } = useQuery(ALL_AUTHORS);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const options = data?.allAuthors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  const submit = (event) => {
    event.preventDefault();

    editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Cambiar año de nacimiento</h2>

      <form onSubmit={submit}>
        <div>
          Autor:
          <Select
            options={options}
            onChange={(selected) => setName(selected.value)}
          />
        </div>

        <div>
          Año:
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>

        <button type="submit">Cambiar</button>
      </form>
    </div>
  );
};

export default EditAuthor;
