import React, { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
import Link from "next/link";

const snarkjs = require("snarkjs");

export default function CreatorSignup() {
  const {
    loginWeb3Auth,
    isAuthenticated,
    safeSelected,
    chainId,
    logoutWeb3Auth,
    web3Provider,
  } = useAccountAbstraction();
  const [verfiyLoding, setVerifyLoding] = useState(false);
  const [userDetails, setUserDetails] = useState<any>();
  const [ageNumber, setAgeNumber] = useState<any>();
  const [ageVerification, setAgeVerification] = useState<boolean>(false);
  const [proof, setProof] = useState("");
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);

  const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      _proofInput,
      _wasm,
      _zkey
    );
    return { proof, publicSignals };
  };

  const verifyProof = async (
    _verificationkey: string,
    signals: any,
    proof: any
  ) => {
    const vkey = await fetch(_verificationkey).then(function (res) {
      return res.json();
    });

    const res = await snarkjs.groth16.verify(vkey, signals, proof);
    setVerifyLoding(false);
    if (res === true) {
      setAgeVerification(true);
      return "Verification OK";
    } else {
      setAgeVerification(false);
      return "Invalid proof";
    }
  };

  async function zkProofCall() {
    console.log("calling.....", userDetails);
    console.log("ageNumber", ageNumber);

    setVerifyLoding(true);
    userDetails === ageNumber
      ? makeProof(
          { age: Number(ageNumber), ageLimit: Number(userDetails) },
          "/zkProof/ageCheck.wasm",
          "/zkProof/ageCheck_0001.zkey"
        ).then(({ proof: _proof, publicSignals: _signals }) => {
          setProof(JSON.stringify(_proof, null, 2));
          setSignals(JSON.stringify(_signals, null, 2));
          verifyProof("/zkProof/verification_key.json", _signals, _proof).then(
            (_isValid: any) => {
              setIsValid(_isValid);
            }
          );
        })
      : setAgeVerification(false);
  }

  // const prevKey: any = process.env.NEXT_PUBLIC_PRV_KEY;
  // const wallet = new Wallet(prevKey);
  // const providerData = getDefaultProvider(web3Provider);
  // const signer: any = wallet.connect(providerData);
  // const db = new Database({signer});
  // const addDB = async () => {
  //   const name = "creator_11155111_189"
  //   const { meta } = await db
  //   .prepare(
  //     `INSERT INTO ${name} (wallet, id, age, profile) VALUES ('0x1234', 'alice', 'yes', 'creator');`
  //     // testing`run` here
  //   )
  //   .run();
  //   await meta.txn?.wait();
  // }


  return (
    <div className="flex justify-center pt-20">
      <div className="w-[40rem] bg-white border border-bliss-grey rounded-xl shadow-xl pb-8">
        <div className="space-y-12 px-8 mt-2">
          <Link href="/dashboard">
              <button className="rounded-full px-8 py-2 bg-bliss-pink text-bliss-white">
                Dashboard
              </button>
            </Link>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Wallet
              </label>
              <div className="mt-2">
                {!isAuthenticated ? (
                  <div className="flex items-center gap-x-6">
                    <button
                      onClick={loginWeb3Auth}
                      className="rounded-full bg-bliss-pink px-3.5 py-2.5 text-sm font-krona text-bliss-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    >
                      Connect Wallet
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>0x00......</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isAuthenticated && (
          <div className="space-y-12 px-8">
            <div className="mt-2">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Enter your age
                  </label>
                  <div className="mt-2">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      onChange={(e) => setUserDetails(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <input
              id="ageTwo"
              name="ageTwo"
              type="number"
              onChange={(e) => setAgeNumber(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div className="mt-2">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-6 flex items-center justify-end gap-x-6 px-8">
            <button
              type="submit"
              onClick={zkProofCall}
              className="rounded-full w-32 bg-bliss-pink px-3 py-2 text-sm font-semibold text-bliss-white shadow-sm hover:bg-opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
