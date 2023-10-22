import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAccountAbstraction } from "../components/store/accountAbstractionContext";
import ConnectedWalletLabel from "../components/Wallet/ConnectedWalletLabel";
import SafeInfo from "../components/Wallet/SafeInfo";
import ConnectWallet from "../components/walletConnect";
import Link from "next/link";
import { useUserData } from "./UserContext";
import NFTMembership from "../components/walletConnect";

export default function Header() {
  const {
    loginWeb3Auth,
    isAuthenticated,
    safeSelected,
    chainId,
    logoutWeb3Auth,
  } = useAccountAbstraction();
   const {showNft} = useUserData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false)

  return (
    <header className="relative inset-x-0 top-0 max-w-7xl mx-auto z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {open && <NFTMembership/>}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-16 w-auto"
              src="logo.png"
              alt="Bliss Flix"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {isAuthenticated && (
            <>
              {safeSelected && (
                <SafeInfo safeAddress={safeSelected} chainId={chainId} />
              )}
              <ConnectedWalletLabel />
              <button
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={logoutWeb3Auth}
              >
                Logout
              </button>
            </>
          )}
        </div>
        {showNft && <div className="pl-10">
          <button onClick={() => setOpen(true)}>
            Membrship Nft
          </button>
        </div>}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          {!isAuthenticated && <div className="flex items-center gap-x-6">
            <button
              onClick={loginWeb3Auth}
              className="rounded-full bg-bliss-pink px-3.5 py-2.5 text-sm font-krona text-bliss-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              Connect Wallet
            </button>
          </div>}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {isAuthenticated && (
                  <>
                    {safeSelected && (
                      <SafeInfo safeAddress={safeSelected} chainId={chainId} />
                    )}
                    <ConnectedWalletLabel />
                    <button
                      className="text-sm font-semibold leading-6 text-gray-900"
                      onClick={logoutWeb3Auth}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
