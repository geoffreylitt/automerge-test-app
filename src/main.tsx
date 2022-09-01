import "./index.css";

import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import localforage from "localforage";

import {
  // @ts-expect-error
  BrowserRepo,
  // @ts-expect-error
  MemoryStorageAdapter,
  // @ts-expect-error
  BroadcastChannelNetworkAdapter,
  Repo,
} from "automerge-repo";

import "./index.css";
import App, { RootDoc } from "./App";
import { RepoContext } from "./hooks";

/* eslint-disable-next-line */
const sharedWorker = new SharedWorker(
  new URL("./shared-worker.js", import.meta.url),
  { type: "module", name: "automerge-repo-shared-worker" }
);

async function getRepo(url: string) {
  return await BrowserRepo({
    storage: new MemoryStorageAdapter(),
    network: [new BroadcastChannelNetworkAdapter()],
  });
}

async function getRootDocument(repo: Repo, initFunction: any) {
  let docId: string | null = window.location.hash.replace(/^#/, "");
  if (!docId) {
    docId = await localforage.getItem("root");
  }
  let rootHandle;

  if (!docId) {
    rootHandle = repo.create();
    rootHandle.change(initFunction);
    await localforage.setItem("root", rootHandle.documentId);
  } else {
    rootHandle = await repo.find(docId);
    window.location.hash = docId;
  }
  return rootHandle;
}

const initFunction = (d: RootDoc) => {
  d.count = 0;
};

const queryString = window.location.search; // Returns:'?q=123'

// Further parsing:
const params = new URLSearchParams(queryString);
const hostname = params.get("host") || "automerge-storage-demo.glitch.me";

getRepo(`wss://${hostname}`).then((repo) => {
  getRootDocument(repo, initFunction).then((rootDoc) => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <RepoContext.Provider value={repo}>
          <App rootDocumentId={rootDoc.documentId} />
        </RepoContext.Provider>
      </React.StrictMode>
    );
  });
});
