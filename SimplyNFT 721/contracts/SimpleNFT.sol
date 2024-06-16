// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimplyToken is ERC721, Ownable {
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public mintPrice;
    bool public isPublicMintEnadled;
    string internal baseTokenURI;
    uint256 public maxPerWallet;
    address payable public withdrawWallet;
    mapping(address => uint256) public mintedWallets;

    constructor(address initialOwner) ERC721("MyToken", "MTK") Ownable(initialOwner) {
        totalSupply = 0;
        maxSupply = 100;
        mintPrice = 0.01 ether;
        maxPerWallet = 3;
    }

    function setIsPublicMintEnadled(bool _isPublicMintEnadled) external onlyOwner {
        isPublicMintEnadled = _isPublicMintEnadled;
    }

    function setBaseTokenURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        _requireOwned(_tokenId);

        return string(abi.encodePacked(baseTokenURI, Strings.toString(_tokenId), ".json"));
    }

    function withdraw() external onlyOwner {
        (bool success,) = withdrawWallet.call{value: address(this).balance}("");
        require(success, "withdraw failed");
    }

    function mint(uint256 _quantity) public payable onlyOwner {
        require(isPublicMintEnadled, "mint not enabled ");
        require(msg.value == _quantity * mintPrice, "wrong mint value");
        require(totalSupply + _quantity <= maxSupply, "sold out");
        require(mintedWallets[msg.sender] + _quantity <= maxPerWallet, "exceed max wallet");

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 tokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(msg.sender, tokenId);
        }
    }
}
