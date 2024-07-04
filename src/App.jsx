import { useState, useEffect } from "react";
import useParty, {
  useConnect,
  useMine,
  useOthers,
  useSync,
} from "@thaon/react.party";

function App() {
  const [isHost, setIsHost] = useState(false);
  const [guests, setGuests] = useState(0);

  const [count, setCount] = useState(0);
  const [others, setOthers] = useState([]);

  // this is optional and always defaults to these values
  const options = {
    url: "wss://realtime.leady.in",
    app: "NodePartyTest",
    room: "NodePartyTest",
  };

  // connect to the server
  useConnect(options);

  // this is required
  const setup = {
    name: "counter",
    initialValues: { count: 0 },
  };

  // this gets executed anytime a change is detected in the shared object
  const onChange = (data) => {
    setCount(data.count);
  };

  // this is the shared object that is synced between clients
  const shared = useSync(setup, onChange);

  // setup for mine and others
  const [myCount, setMyCount] = useState(0);

  const mine = useMine({ count: 0 }, (data) => {
    setMyCount(data.count);
  });

  useOthers((data) => {
    setOthers(data);
  });

  // we can use the useParty hook to access properties, such as whether we are the host, or the number of isC clients
  const { isConnected, party, users } = useParty();

  // we update who's the host, in case of disconnections
  useEffect(() => {
    if (!party) return;
    setIsHost(party.isHost());

    setGuests(users.length);
  }, [users]);

  return (
    <>
      <h1>Vite + React + Party</h1>
      <h2>Connected: {isConnected ? "Yes" : "No"}</h2>
      <hr />
      {isHost ? <h2>Host</h2> : <h2>Guest</h2>}
      <hr />
      <h3>Users: {guests}</h3>
      <div className="card">
        <button
          onClick={() => {
            shared.count++;
          }}
          // disabled={!isHost}
        >
          count is {count}
        </button>
      </div>
      <hr />
      <div className="card">
        <h3>Mine</h3>
        <button
          onClick={() => {
            mine.count++;
          }}
        >
          count is {myCount}
        </button>
      </div>
      <hr />
      <div className="card">
        <h3>Others</h3>
        <ul>
          {(others || []).map((other, index) => (
            <li key={index}>{other.count}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
