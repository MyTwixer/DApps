// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/compound.sol";
import "./interfaces/Uniswap.sol";

contract TestCompoundLong {
  CEth public cEth;
  CErc20 public cTokenBorrow;
  IERC20 public tokenBorrow;
  uint public decimals;

  // Define the Comptroller contract
  Comptroller public comptroller =
    Comptroller(0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B);

  // Define the PriceFeed contract
  PriceFeed public priceFeed = PriceFeed(0x922018674c12a7F0D394ebEEf9B58F186CdE13c1);

  // Define the Uniswap V2 Router contract
  IUniswapV2Router private constant UNI =
    IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

  // Define the Wrapped Ether (WETH) contract
  IERC20 private constant WETH = IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

  constructor(
    address _cEth,
    address _cTokenBorrow,
    address _tokenBorrow,
    uint _decimals
  ) {
    cEth = CEth(_cEth);
    cTokenBorrow = CErc20(_cTokenBorrow);
    tokenBorrow = IERC20(_tokenBorrow);
    decimals = _decimals;

    // Enter the market to enable borrowing
    address[] memory cTokens = new address[](1);
    cTokens[0] = address(cEth);
    uint[] memory errors = comptroller.enterMarkets(cTokens);
    require(errors[0] == 0, "Comptroller.enterMarkets failed.");
  }

  receive() external payable {}

  function supply() external payable {
    cEth.mint{value: msg.value};
  }

  function getMaxBorrow() external view returns (uint) {
    (uint error, uint liquidity, uint shortfall) = comptroller.getAccountLiquidity(
      address(this)
    );

    require(error == 0, "error");
    require(shortfall == 0, "shortfall > 0");
    require(liquidity > 0, "liquidity = 0");

    uint price = priceFeed.getUnderlyingPrice(address(cTokenBorrow));
    uint maxBorrow = (liquidity * (10**decimals)) / price;

    return maxBorrow;
  }

  // Function to long (borrow) Ether
  function long(uint _borrowAmount) external {
    require(cTokenBorrow.borrow(_borrowAmount) == 0, "borrow failed");

    // Buy Ether using token borrow
    uint bal = tokenBorrow.balanceOf(address(this));
    tokenBorrow.approve(address(UNI), bal);

    address[] memory path = new address[](2);
    path[0] = address(tokenBorrow);
    path[1] = address(WETH);
    UNI.swapExactTokensForETH(_borrowAmount, 1, path, address(this), block.timestamp);
  }

  function repay() external {
    // Sell Ether using token borrow
    address[] memory path = new address[](2);
    path[0] = address(WETH);
    path[1] = address(tokenBorrow);
    UNI.swapExactETHForTokens{value: address(this).balance}(
      1,
      path,
      address(this),
      block.timestamp
    );

    // Repay the borrowed Ether
    uint borrowed = cTokenBorrow.borrowBalanceCurrent(address(this));
    tokenBorrow.approve(address(cTokenBorrow), borrowed);
    require(cTokenBorrow.repayBorrow(borrowed) == 0, "repay failed");

    // Redeem the supplied Ether
    uint supplied = cEth.balanceOfUnderlying(address(this));
    require(cEth.redeemUnderlying(supplied) == 0, "redeem failed");
  }


  function getAccountLiquidity() external view returns (uint liquidity, uint shortfall) {
    // Liquidity and shortfall in USD scaled up by 1e18
    (uint error, uint _liquidity, uint _shortfall) = comptroller.getAccountLiquidity(
      address(this)
    );

    require(error == 0, "error");
    return (_liquidity, _shortfall);
  }
}