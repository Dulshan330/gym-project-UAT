import { Provider } from "jotai";
import React from "react";

interface JotaiProviderProps {
  children: React.ReactNode;
}

const JotaiProvider: React.FC<JotaiProviderProps> = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export default JotaiProvider;
