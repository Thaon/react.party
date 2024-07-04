# react.party

A multiplayer framework for React

React.party is inspired (and also a modified fork) of the amazing p5.party!

Following the same principles, it aims to enable multiplayer functionality in React applications in the cleanest and easiest way possible.

It relies on a Deepstream server for communication and uses WebSockets.

## Installation

To use this library, first, ensure you have NodeParty and its dependencies set up in your project. Then, add this library to your project:

```bash
npm install react.party
```

## Usage

### Connecting to a NodeParty Server

To connect to a NodeParty server and manage real-time user connections, use the useConnect hook.

```js
import React from "react";
import { useConnect } from "path-to-useParty";

function App() {
  const isConnected = useConnect({
    url: "wss://yourserver.com", // WebSocket server URL, this is optional as it defaults to the react.party test server
    app: "YourAppName", // Application name
    room: "YourRoomName", // Room name
  });

  return <div>{isConnected ? "Connected to NodeParty" : "Connecting..."}</div>;
}
```

### Synchronizing Shared State

To synchronize a shared state across clients, use the useSync hook.

```js
import React from "react";
import { useSync } from "path-to-useParty";

function SharedCounter() {
  const setup = { name: "counter", initialValues: { count: 0 } };
  const sharedCounter = useSync(setup, (newState) => {
    console.log("New counter state:", newState);
  });

  return <div>Current count: {sharedCounter?.count || 0}</div>;
}
```

### Managing Personal and Others' States

For personal state management and listening to others' state changes, use useMine and useOthers hooks respectively.

```js
import React from "react";
import { useMine, useOthers } from "path-to-useParty";

function PersonalState() {
  const myState = useMine({ myKey: "initialValue" }, (newState) => {
    console.log("My new state:", newState);
  });

  // Use `useOthers` similarly to listen to others' state changes.
  const othersState = useOthers((newState) => {
    console.log("Others new state:", newState);
  });

  return (
    <div>
      My state: {JSON.stringify(myState)}
      <br />
      Others state: {JSON.stringify(othersState)}
    </div>
  );
}
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements or suggestions.

### License

This library is licensed under MIT, see the LICENSE file for details.
