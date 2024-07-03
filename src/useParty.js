import { useEffect, useState } from "react";

import { atom, useAtom } from "jotai";

import NodeParty from "node.party";

const nodeParty = atom(new NodeParty());
const connected = atom(false);
const users = atom([]);

export const useSync = (options, setup, onChange) => {
  const [party] = useAtom(nodeParty);
  return usePartyFunction(
    async () => party.loadShared(setup.name, setup.initialValues),
    options,
    onChange
  );
};

export const useMine = (options, initialValues, onChange) => {
  const [party] = useAtom(nodeParty);
  return usePartyFunction(
    async () => party.loadMine(initialValues),
    options,
    onChange
  );
};

export const useOthers = (options, onChange) => {
  const [party] = useAtom(nodeParty);
  return usePartyFunction(() => party.loadOthers(onChange), options);
};

const usePartyFunction = (func, options, onChange) => {
  const [shared, setShared] = useState(null);
  const [party] = useAtom(nodeParty);
  const [isConnected, setIsConnected] = useAtom(connected);
  const [, setUsers] = useAtom(users);

  useEffect(() => {
    const init = async () => {
      if (!isConnected) {
        // connect to the server
        await party.connect(
          options?.url || "wss://realtime.leady.in",
          options?.app || "NodePartyTest",
          options?.room || "NodePartyTest",
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
        onChange(sharedObj);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (shared && onChange) {
      onChange(shared);
    }
  }, [shared]);

  return shared;
};

export default function useParty() {
  const [isConnected] = useAtom(connected);
  const [party] = useAtom(nodeParty);
  const [connections] = useAtom(users);

  useEffect(() => {}, [connections?.length]);

  if (isConnected) return { party, users: [...connections] };
  else
    return {
      party: null,
      users: [],
    };
}
