import { useRouter } from "next/router";
import { useUserData } from "./UserContext";
import ConnectedWalletLabel from "./Wallet/ConnectedWalletLabel";
import SafeInfo from "./Wallet/SafeInfo";
import { useAccountAbstraction } from "./store/accountAbstractionContext";
import { Fragment, useEffect } from "react";
import chains, { baseGoerli, initialChain } from "@/utils/chains";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const AuthKitDemo = () => {
  const { loginWeb3Auth, isAuthenticated, safeSelected, chainId, setChainId } = useAccountAbstraction();
  console.log("chainId", chainId);
  
  const router: any = useRouter();
  const { ownerAddress } = useAccountAbstraction();
  const { allUser } = useUserData();

  useEffect(() => {
    if (isAuthenticated && allUser) {
      const userExists = allUser.filter(
        (item: { id: string | undefined }) => item.id === ownerAddress
      );
      userExists.length
        ? router.push("/chat", null, { shallow: true })
        : router.push("/verify", null, { shallow: true });
    }
  }, [isAuthenticated, allUser]);

  return (
    <>
      {isAuthenticated ? (
        <div>
          {/* safe Account */}
          <div>
            {/* Safe Info */}
            {safeSelected && (
              <SafeInfo safeAddress={safeSelected} chainId={chainId} />
            )}
          </div>

          {/* owner ID */}
          <div>
            <p>Owner ID</p>
            {/* Owner details */}
            <ConnectedWalletLabel />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-x-6">
          <button onClick={() => setChainId("0x14a33")}>BAse</button>
          <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Options
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </Menu.Button>
          </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {chains.map(item => <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                 {item.label}
                </a>
              )}
            </Menu.Item>
          </div>)}
        </Menu.Items>
      </Transition>
    </Menu>
          <button
            onClick={loginWeb3Auth}
            className="rounded-full bg-red-500 px-3.5 py-2.5 text-sm font-krona text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
};

export default AuthKitDemo;
