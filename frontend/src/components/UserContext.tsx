import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAccountAbstraction } from "./store/accountAbstractionContext";
import Web3 from "web3";

type Props = object;
export const UserContext = createContext<any>(null);
const AppContext: React.FC<Props> = ({ children }: any) => {
  const { web3Provider, ownerAddress, chain }: any = useAccountAbstraction();
  const web3: any = new Web3(web3Provider?.provider);
  const [profileState, setProfileState] = useState("");
  const [showNft, setShowNft] = useState(false);

  const handleProfileState = (value: any) => {
    setProfileState(value)
  }

  return (
    <UserContext.Provider
      value={{
        setProfileState,
        profileState,
        handleProfileState,
        setShowNft,
        showNft
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserData = () => useContext(UserContext);

export { AppContext, useUserData };
