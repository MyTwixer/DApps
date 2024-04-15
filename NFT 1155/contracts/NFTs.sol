// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyNFT is ERC1155, ERC1155URIStorage {
    constructor() ERC1155("https://my-nft-metadata.com/{id}.json") {}

    function mintNFT(address to, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId, "");
        _setURI(newItemId, tokenURI);

        return newItemId;
    }
}