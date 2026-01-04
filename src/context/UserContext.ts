import type { IUser } from "@/models/admin.type";
import type { Dispatch } from "react";

type State = {
  user: IUser | null;
};

type Action =
  | { type: "Login"; payload: IUser }
  | { type: "logout" };

export type UserContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

export function userReducer(state: { user: IUser | null }, action: Action) {
    switch (action.type) {
        case 'Login':
            return { user: action.payload }
        case 'logout':
            return { user: null }
        default:
            return state;
    }
}