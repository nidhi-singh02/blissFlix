const axios = require('axios');

export const pinJSONToIPFS = async(JSONBody: any) => {
    const AUTH =
    "Bearer " +
    process.env.NEXT_PUBLIC_BEARER;
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                Authorization: AUTH,
            },
        })
        .then(function (response: any) {
           return {
               success: true,
               cid: response.data.IpfsHash,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error: any) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};