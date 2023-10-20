import * as LitJsSdk from "lit-js-sdk";
var axios = require("axios");
require("dotenv").config();

export async function handleDatatoCid(data: any, chain: any) {
  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
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
    .then((response: any) => {});

  var cid = "";
  const cid_data = await axios
    .post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      "Content-Type": "application/json",
      headers: {
        Authorization: AUTH,
      },
    })
    .then((response: any) => {
      cid = response.data.IpfsHash;
    });
  const cid_xx = await cid_data;
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  var encryptedString;
  var encryptedSymmetricKey;
  try {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const str = "heyencryptdata";
    const json = JSON.stringify({ key: cid });
    const blobData = new Blob([json], { type: "text/plain;charset=utf-8" });
    const res = await LitJsSdk.encrypt(blobData);
    encryptedString = res.encryptedString;
    let symmetricKey = res.symmetricKey;
    encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey: symmetricKey,
      authSig: authSig,
      chain: "ethereum",
    });
  } catch (error) {
    console.log("error", error);
  }
  return { encryptedSymmetricKey, cid, encryptedString };
}

export async function getIpfsData(
  cid: any,
  chain: any,
  encryptData: any,
  baseData: any
) {
  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
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
