// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("My Vault Token","MVT"){
        _mint(msg.sender, 1000000 * 1e18);
    }
}