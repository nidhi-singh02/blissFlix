"use client";
import {
  useAccount,
  useConnect
} from "wagmi";
import {
  SismoConnectConfig,
} from "@sismo-core/sismo-connect-react";

const sismoConnectConfig: SismoConnectConfig = {
  appId: "0x75c26d287384fb71b73f2e94ff1c30ad",
};

export default function SismoConnect() {
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { isConnected, address } = useAccount();

  return (
    <>
      <main>
        {!isConnected && (
          <>
            {connectors.map((connector: any) => (
              <button
                disabled={!connector.ready || isLoading}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {isLoading && pendingConnector?.id === connector.id
                  ? "Connecting..."
                  : "Sismo Connect wallet"}
              </button>
            ))}
          </>
        )}
      </main>
    </>
  );
}
