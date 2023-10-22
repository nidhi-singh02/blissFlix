import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewerDashboard() {
  const [cidData, setCidData] = useState([]);

  const AUTH = "Bearer " + process.env.NEXT_PUBLIC_BEARER;

  const getAllVid = () => {
    axios
      .get("https://api.pinata.cloud/data/pinList/", {
        headers: {
          Authorization: AUTH,
        },
      })
      .then((response: any) => {
        getCidData(response.data.rows);
      });
  };

  const getCidData = async (ipfsData: any) => {
    const arr: any = [];
    ipfsData.map(async (item: any) => {
      axios
        .get(` https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`)
        .then((response: any) => {
          const cidData = response.data;
          arr.push(cidData);
          setCidData(arr);
        });
    });
  };

  useEffect(() => {
    getAllVid();
  }, []);

  return (
    <div className="relative pt-14">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {cidData &&
              cidData.map((item: any, index: any) => (
                <div
                  key={index}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-[16rem]">
                    <video controls>
                      <source src={item.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="flex flex-1 flex-col space-y-2 p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.discription}</p>
                    <div className="flex flex-1 flex-col justify-end">
                      <p className="text-base font-medium text-gray-900">
                        {item.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
