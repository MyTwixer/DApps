// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./utilis/ERC4626Fees.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Vault is ERC4626Fees {

    address payable public owner;
    uint public entryFeeBasisPoints;
    constructor(IERC20 _assets, uint _basisPoint) ERC4626(_assets) ERC20("Vault Token", "vTKN"){
        owner = payable(msg.sender);
        entryFeeBasisPoints = _basisPoint; 
    }

    function _entryFeeBasisPoints() internal view override returns (uint256) {
        return entryFeeBasisPoints; 
    }

    function _entryFeeRecipient() internal view override returns (address) {
        return owner;
    }

}