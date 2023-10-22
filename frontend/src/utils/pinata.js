import * as LitJsSdk from "lit-js-sdk";
var axios = require("axios");
require("dotenv").config();

export async function handleDatatoCid(data, chain) { 
   
  const accessControlConditions = [
    {
      contractAddress: "0x53206A03fd037A85EFaeD3019Faa8C0649F21169",
      standardContractType: "",
      chain: "goerli",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0",
      },
    },
  ];

  const AUTH =
    "Bearer " +
    process.env.NEXT_PUBLIC_BEARER;
  // Check Connection
  axios
    .get("https://api.pinata.cloud/data/testAuthentication", {
      headers: {
        Authorization: AUTH,
      },
    })
    .then((response) => {console.log("response", response);
    });

  var cid = "";
  const cid_data = await axios
    .post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      "Content-Type": "application/json",
      headers: {
        Authorization: AUTH,
      },
    })
    .then((response) => {
      cid = response.data.IpfsHash;
      
    })
  const cid_xx = await cid_data;
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  var encryptedString;
  var encryptedSymmetricKey;
  if(!cid) {
    try {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
      const res = await LitJsSdk.encryptString(cid);
      encryptedString = res.encryptedString;
      let symmetricKey = res.symmetricKey;
      encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey: symmetricKey,
        authSig: authSig,
        chain: "goerli",
      });
    } catch (error) {
      console.log("error", error);
    }
  }
  return { encryptedSymmetricKey, cid, encryptedString };
}

export async function getIpfsData(
  cid,
  chain,
  encryptData,
  baseData
) {
  const accessControlConditions = [
    {
      contractAddress: "0x53206A03fd037A85EFaeD3019Faa8C0649F21169",
      standardContractType: "",
      chain: "goerli",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0",
      },
    },
  ];
  const cidData = axios.get(` https://gateway.pinata.cloud/ipfs/${cid}`);
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  var decryptedString;
  try {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const toDecrypt = await LitJsSdk.uint8arrayToString(encryptData, "base16");
    const encryptionKey = await litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: toDecrypt,
      authSig: authSig,
      chain: "ethereum",
    });
    const base64EncryptedString = await LitJsSdk.blobToBase64String(baseData);
    const blob = LitJsSdk.base64StringToBlob(base64EncryptedString);
    decryptedString = await LitJsSdk.decryptString(blob, encryptionKey);
  } catch (error) {
    console.log(error);
  }
  const jsonData = await cidData;
  return { decryptedString, jsonData };
}
