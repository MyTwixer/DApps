// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TaxToken is ERC20 {

    uint constant taxDiviser = 10;
    
    constructor() ERC20("TaxToken", "TXT") {}

    function myMint(uint amount) public {
        _mint(msg.sender, amount);
    }

    function transfer(address to, uint value) public override returns(bool) {
        uint balanceSender = balanceOf(msg.sender);
        require(balanceSender >= value, "Wrong value");

        uint taxAmount = value / taxDiviser;
        uint transferAmount = value - taxAmount;

        _transfer(msg.sender, to, transferAmount);
        _transfer(msg.sender, address(0), taxAmount);
        
        return true;
    }
}