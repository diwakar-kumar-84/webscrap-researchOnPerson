import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [result, setresult] = useState();
  const [inp, setinp] = useState();
  const handleClick = () => {
    setresult(null);
    axios
      .get(`http://localhost:5000/search/${inp}`)
      .then((res) => {
        setresult(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container">
      {console.log(inp)}
      <div className="form-group ">
        <label htmlFor="exampleInputEmail1">Enter name to Search</label>
        <input
          className="form-control"
          type="text"
          onChange={(e) => setinp(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={() => handleClick()}>
          submit
        </button>
      </div>

      {result ? (
        <div>
          <img src={result.url} alt="..." />
          {/* <iframe src={result.url}></iframe> */}
          <h3 className="text-info">Name:{result.name}</h3>
          <h3 className="text-primary">Dob:{result.dob}</h3>
          <h3 className="text-secondary">Spouse:{result.spouse}</h3>
          <p className="card">
            <strong>Social Detail:</strong>
            {result.about}
          </p>
          <p className="card">
            <strong>Professional Deatils:</strong>
            {result.professional}
          </p>
          <div>
            <strong>Patent List:</strong>
            {result.patent
              ? result.patent.map((i, ind) => {
                  return (
                    <div>
                      <li key={ind} className="card mt-4">
                        {i}
                      </li>
                      {/* <hr /> */}
                    </div>
                  );
                })
              : "No Patents"}
          </div>
        </div>
      ) : (
        "Data Loading....."
      )}
    </div>
  );
}

export default App;
