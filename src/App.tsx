import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useDocument, useHandle } from "./hooks";

export type RootDoc = {
  count: number;
};

function App({ rootDocumentId }: { rootDocumentId: string }) {
  const [count, setCount] = useState(0);
  const [doc, changeDoc] = useDocument<RootDoc>(rootDocumentId);

  if (doc === undefined) {
    return <></>;
  }

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => changeDoc((d) => (d.count += 1))}>
          count is {doc.count} hi
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
