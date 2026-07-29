import React from "react";

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }

  return (
    <div
      style={{
        color: "red",
        marginBottom: "10px",
      }}
    >
      {errorMessage}
    </div>
  );
};

export default Notify;
