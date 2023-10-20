"use client";
import { useAccount, useConnect } from "wagmi";
import { SismoConnectConfig } from "@sismo-core/sismo-connect-react";

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
                className="w-[20rem] mt-6 border border-black px-3.5 py-2.5 text-sm text-bliss-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
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
