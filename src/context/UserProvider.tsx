import { createContext, useContext, useReducer } from "react";
import { userReducer, type UserContextType } from "./UserContext";

type UserProviderProps = {
    children: React.ReactNode
}

const initialState = {
    user: null
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser debe usarse dentro de <UserProvider>");
  }

  return context;
}
