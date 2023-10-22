import React, { useContext, useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import Web3 from "web3";
import NFTABI from "../abi/nft.json";
import { pinJSONToIPFS } from "@/utils/nftPinata";
import Link from "next/link";
import { useUserData } from "@/components/UserContext";
const { Database } = require("@tableland/sdk");
const { Wallet, ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
const privateKey = process.env.NEXT_PUBLIC_PRV_KEY;
const wallet = new Wallet(privateKey);
const network = "sepolia";
const snarkjs = require("snarkjs");

export default function CreatorSignup() {
  const {
    loginWeb3Auth,
    isAuthenticated,
    safeSelected,
    chainId,
    logoutWeb3Auth,
    web3Provider,
    ownerAddress,
  } = useAccountAbstraction();
   const {setShowNft} = useUserData()
  const [verfiyLoding, setVerifyLoding] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({
    wallet: "",
    name: "",
    age: "",
    profile: "",
    cid: "",
    member: false
  });
  const [ageNumber, setAgeNumber] = useState<any>();
  const [base64Image, setBase64Image] = useState<any>('');
  const [ageVerification, setAgeVerification] = useState<boolean>(false);
  const [proof, setProof] = useState("");
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [userData, setUserData] = useState();
  const [successState, setSuccessState] = useState(false);
  const providerData: any = web3Provider;
  const web3: any = new Web3(providerData?.provider);

  const NftContract: any =
    chainId &&
    new web3.eth.Contract(NFTABI, "0xA72447714BF764Ef28Bc21F1C7597D178Bf11d36");

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
      handleCreatorDetails("age", true)
      setAgeVerification(true);
      return "Verification OK";
    } else {
      setAgeVerification(false);
      return "Invalid proof";
    }
  };

  async function zkProofCall(value: any) {
    setVerifyLoding(true);
    ageNumber === value
      ? makeProof(
          { age: Number(value), ageLimit: Number(value) },
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

  const handleCreatorDetails = (key: any, val: any) => {
    setUserDetails((prevState: any) => ({
      ...prevState,
      [key]: val,
    }));
  };

  useEffect(() => {
    if(ageNumber) {
      zkProofCall(ageNumber)
      handleCreatorDetails("wallet", ownerAddress)
      handleCreatorDetails("profile", "creator")
    }

  }, [ageNumber])

  const handleSubmit = async () => {
    if(ageVerification) {
      mintNFT()
    }
  }

  useEffect(() => {
    const imagePath = 'membership.jpeg';
    fetch(imagePath)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          setBase64Image(base64String);
        };
        reader.readAsDataURL(blob);
      });
  })

  const mintNFT = async () => {
    setShowNft(true)
    const estimatedGasPriceFromWeb3 = await web3.eth.getGasPrice();
    const metadata: any = new Object();
    metadata.name = ownerAddress;
    metadata.image = base64Image;
    metadata.description = "Creator Membership";
    //make pinata call
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI = pinataResponse.pinataUrl;
    handleCreatorDetails("member", true);
    handleCreatorDetails("cid", pinataResponse.cid)
    // if(tokenURI) {
    //   await NftContract.methods
    //   .safeMint(ownerAddress, tokenURI)
    //   .send({
    //     from: ownerAddress,
    //     gasPrice: estimatedGasPriceFromWeb3,
    //   })
    //   .on("transactionHash", async (hash: any) => {
    //     console.log("hash", hash)
    //   })
    //   .on("receipt", function (receipt: any) {
    //     console.log("receipt", receipt);
    //   })
    //   .on("error", function (error: any) {
    //     console.log("error", error);
    //   });
    // }
  }

 

  const infuraProvider = new ethers.providers.InfuraProvider(network, process.env.NEXT_PUBLIC_INFURA);
  const signer = wallet.connect(infuraProvider);
  const db = new Database({ signer });

  const getDB = async () => {
    const tableName = `creator_11155111_189`;  
    const stmt = db.prepare(`SELECT * FROM ${tableName};`);
    const getAllData = await stmt.all()
    setUserData(getAllData.results);
  }

  const addDB = async () => {
    const name = "creator_details_11155111_310"
    const { meta } = await db
    .prepare(
      `INSERT INTO ${name} (wallet, name, age, profile, cid, member) VALUES (${userDetails.wallet}, ${userDetails.name}, ${userDetails.age}, ${userDetails.profile}, ${userDetails.cid}, ${userDetails.member});`
      // testing`run` here
    )
    .run();
    setSuccessState(true)

    try {
      await meta.txn?.wait();
    }catch (error) {
      console.log("error");
    }
 
  }

  useEffect(() => {
    userDetails.member == true && addDB()
  }, [userDetails.member])


  return (
    <div className="flex justify-center pt-20">
      <div className="w-[40rem] bg-white border border-bliss-grey rounded-xl shadow-xl pb-8">
        <div className="space-y-12 px-8 mt-2">
          <h1 className="text-bliss-black text-center pt-4 font-bold text-xl">Creator Signup/Login</h1>
          <div className="mt-10">
            <div className="w-full">
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
                    <input
                      id="address"
                      name="address"
                      type="text"
                      disabled={true}
                      value={ownerAddress}
                      className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isAuthenticated && (
          <div className="space-y-12 px-8">
            <div className="mt-2">
              <div className="mt-10 ">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Enter user name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      onChange={(e) => handleCreatorDetails("name", e.target.value)}
                      className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Enter your age
              </label>
              <input
                id="age"
                name="age"
                type="age"
                onChange={(e) => setAgeNumber(e.target.value)}
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
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
            {successState ? <Link
              href="/dashboard"
              className="rounded-full text-center w-32 bg-green-700 px-3 py-2 text-sm font-semibold text-bliss-white shadow-sm hover:bg-opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sucess
            </Link>:  <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-full w-32 bg-bliss-pink px-3 py-2 text-sm font-semibold text-bliss-white shadow-sm hover:bg-opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify
            </button>}
          </div>
        )}
      </div>
    </div>
  );
}
