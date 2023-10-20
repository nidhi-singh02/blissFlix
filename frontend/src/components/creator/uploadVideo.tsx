import React, { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import { handleDatatoCid, getIpfsData } from "@/utils/pinata";

export default function UploadForm() {
  const {
    loginWeb3Auth,
    isAuthenticated,
    safeSelected,
    chainId,
    logoutWeb3Auth,
  } = useAccountAbstraction();
  const [userDetails, setCreatorDetails] = useState<any>({
    title: "",
    discription: "",
    video: "",
    premium: false,
    amount: 0,
  });
  const [premiumState, setPremiumState] = useState("");
  const [encryptData, setEncryptData] = useState();
  const [baseData, setBaseData] = useState();

  const handleCreatorDetails = (key: any, val: any) => {
    setCreatorDetails((prevState: any) => ({
      ...prevState,
      [key]: val,
    }));
  };

  const chain = "ethereum";

  const getDataFromCid = () => {
    const cidData = getIpfsData(
      "Qmct8Ekj9Xmc8Rk5QPZ8Bp6zWoKuFDascdyAxy72wPYMAi",
      chain,
      encryptData,
      baseData
    );
    console.log("getDataFromCid", cidData);
  };

  const handleSubmit = () => {
    const data = handleDatatoCid(userDetails, chain);
    console.log("data", data);
  };

  const videoMethods = [
    { id: "premium", title: "Premium" },
    { id: "free", title: "Free" },
  ];

  return (
    <div className="flex justify-center pt-20">
      <div className="w-[40rem] border border-bliss-grey rounded-xl shadow-xl pb-8">
        <div className="space-y-12 px-8">
          <div className="mt-2">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    onChange={(e) =>
                      handleCreatorDetails(e.target.id, e.target.value)
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4 pt-4">
              <label
                htmlFor="discription"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Discription
              </label>
              <div className="mt-2">
                <textarea
                  id="discription"
                  name="discription"
                  onChange={(e) =>
                    handleCreatorDetails(e.target.id, e.target.value)
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
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

          <div>
            <div>
              <label className="text-base font-semibold text-gray-900">
                Earn Money
              </label>
              <p className="text-sm text-gray-500">
                How do you prefer your video to be premium or free?
              </p>
              <fieldset className="mt-4">
                <legend className="sr-only">Notification method</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {videoMethods.map((videoMethod) => (
                    <div key={videoMethod.id} className="flex items-center">
                      <input
                        id={videoMethod.id}
                        name="premium"
                        type="radio"
                        onClick={(e) => {
                          setPremiumState(videoMethod.id);
                          handleCreatorDetails(
                            "premium",
                            videoMethod.id === "premium" ? true : false
                          );
                        }}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor={videoMethod.id}
                        className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                      >
                        {videoMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            {premiumState === "premium" && (
              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Enter amount
                </label>
                <div className="mt-2">
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    onChange={(e) =>
                      handleCreatorDetails(e.target.id, e.target.value)
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6 px-8">
          <button
            type="submit"
            onClick={() => handleSubmit()}
            className="rounded-full w-32 bg-bliss-pink px-3 py-2 text-sm font-semibold text-bliss-white shadow-sm hover:bg-opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
