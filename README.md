# react.party

A multiplayer framework for React

React.party is inspired (and also a modified fork) of the amazing p5.party!

Following the same principles, it aims to enable multiplayer functionality in React applications in the cleanest and easiest way possible.

It relies on a Deepstream server for communication and uses WebSockets.

## Installation

To use this library, first, ensure you have NodeParty and its dependencies set up in your project. Then, add this library to your project:

```bash
npm install @thaon/react.party
@thaon/react.party
@thaon/react.party
```

## Usage

### Connecting to a NodeParty Server

To connect to a NodeParty server and manage real-time user connections, use the useConnect hook.

```js
import React from "react";
import useParty, { useConnect } from "@thaon/react.party";

function App() {
  useConnect({
    url: "wss://yourserver.com", // WebSocket server URL, this is optional as it defaults to the react.party test server
    app: "YourAppName", // Application name
    room: "YourRoomName", // Room name
  });

  const { isConnected } = useParty();

  return <div>{isConnected ? "Connected to NodeParty" : "Connecting..."}</div>;
}
```

### Synchronizing Shared State

To synchronize a shared state across clients, use the useSync hook.

```js
import { useState } from "react";
import { useSync } from "@thaon/react.party";

function SharedCounter() {
  const [count, setCount] = useState(0);

  const setup = { name: "counter", initialValues: { count: 0 } };
  const onChange = (newState) => {
    console.log("New counter state:", newState);
    setCount(newState.count);
  };
  const sharedCounter = useSync(setup, onChange);

  return <div>Current count: {count}</div>;
}
```

### Managing Personal and Others' States

For personal state management and listening to others' state changes, use useMine and useOthers hooks respectively.

```js
import { useState } from "react";
import { useMine, useOthers } from "@thaon/react.party";

function PersonalState() {
  const [myCount, setMyCount] = useState(0);
  const [others, setOthers] = useState([]);

  const mine = useMine({ count: 0 }, (data) => {
    setMyCount(data.count);
  });

  // Use `useOthers` similarly to listen to others' state changes.
  useOthers((data) => {
    setOthers(data);
  });

  return (
    <div>
      My count: {myCount}
      <button
        onClick={() => {
          // note that we update the state directly as this is how the library keeps track of changes online
          mine.count++;
        }}
      >
        my count ++
      </button>
      <br />
      Others:
      <ul>
        {(others || []).map((other, index) => (
          <li key={index}>{other.count}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements or suggestions.

### License

This library is licensed under MIT, see the LICENSE file for details.
