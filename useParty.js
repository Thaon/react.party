import { useEffect, useState } from "react";

import { atom, useAtom } from "jotai";
import NodeParty from "node.party";

const nodeParty = atom(new NodeParty());
const connOptions = atom(null);
const connected = atom(false);
const users = atom([]);

export const useConnect = (options) => {
  const [serverOptions, setServerOptions] = useAtom(connOptions);

  if (serverOptions) return;

  setServerOptions(options);
};

export const useSync = (setup, onChange) => {
  const [party] = useAtom(nodeParty);
  return usePartyFunction(
    async () => party.loadShared(setup.name, setup.initialValues),
    onChange
  );
};

export const useMine = (initialValues, onChange) => {
  const [party] = useAtom(nodeParty);
  return usePartyFunction(async () => party.loadMine(initialValues), onChange);
};

export const useOthers = async (onChange) => {
  const [isConnected, setIsConnected] = useAtom(connected);
  const [party] = useAtom(nodeParty);
  const [serverOptions] = useAtom(connOptions);
  const [, setUsers] = useAtom(users);

  if (!serverOptions) {
    console.error("You must call useConnect() before using the other hooks.");
    return;
  }

  if (!isConnected) {
    // connect to the server
    await party.connect(
      serverOptions?.url || "wss://realtime.leady.in",
      serverOptions?.app || "NodePartyTest",
      serverOptions?.room || "NodePartyTest",
      null,
      (conns) => {
        // console.log("CONNS", conns.length);
        setUsers(conns);
      }
    );
    setIsConnected(true);
    setUsers(party.getInfo().guestNames);
  }

  party.loadOthers(onChange);
};

const usePartyFunction = (func, onChange) => {
  const [serverOptions] = useAtom(connOptions);
  const [shared, setShared] = useState(null);
  const [party] = useAtom(nodeParty);
  const [isConnected, setIsConnected] = useAtom(connected);
  const [, setUsers] = useAtom(users);

  if (!serverOptions) {
    console.error("You must call useConnect() before using the other hooks.");
    return;
  }

  useEffect(() => {
    const init = async () => {
      if (!isConnected) {
        // connect to the server
        await party.connect(
          serverOptions?.url || "wss://realtime.leady.in",
          serverOptions?.app || "NodePartyTest",
          serverOptions?.room || "NodePartyTest",
          null,
          (conns) => {
            // console.log("CONNS", conns.length);
            setUsers(conns);
          }
        );
        setIsConnected(true);
        setUsers(party.getInfo().guestNames);
      }

      let sharedObj = await func();
      setShared(sharedObj);
      if (onChange) {
        party.watchShared(sharedObj, (data) => {
          onChange(data);
        });
        onChange({ ...sharedObj });
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (isConnected && shared && onChange) {
      onChange({ ...shared });
    }
  }, [shared]);

  return shared;
};

export default function useParty() {
  const [isConnected] = useAtom(connected);
  const [party] = useAtom(nodeParty);
  const [connections] = useAtom(users);

  useEffect(() => {}, [connections?.length]);

  if (isConnected) return { isConnected, party, users: [...connections] };
  else
    return {
      isConnected: false,
      party: null,
      users: [],
    };
}
