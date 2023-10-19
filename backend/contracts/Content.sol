pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Content {

    struct Data {
        address walletAddress;
        string[] cids;
        string role;
    }

    mapping(address => Data) public dataStore;
    IERC20 public token;

    constructor(IERC20 _token) {
        token = _token;
    }

    function storeData(address _walletAddress, string memory _cid) public {
        dataStore[_walletAddress].walletAddress = _walletAddress;
        dataStore[_walletAddress].cids.push(_cid);
        dataStore[_walletAddress].role = "creator";

    }

    function getData(address _walletAddress) public view returns (address, string[] memory) {
        return (dataStore[_walletAddress].walletAddress, dataStore[_walletAddress].cids);
    }

    function transferAndStoreData(address _to, uint256 _amount, string memory _cid) public {
        bool success = token.transferFrom(msg.sender, _to, _amount);
        require(success, "Transfer failed");

        dataStore[_to].walletAddress = _to;
        dataStore[_to].cids.push(_cid);
        dataStore[_to].role = "viewer";
    }
}
