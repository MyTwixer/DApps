// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeFiLending {
    event EvDeposit(uint256 amount, address sender,uint256 timestamp);
    event Borrow (uint256 amount, address recipient);
    event Repay (address sender, uint256 repayAmount, uint256 totalCollateralAmount);
    event ProvideCollateral (address sender, uint256 amount);

    struct Deposit {
        uint256 amount;
        uint256 depositTime;
    }

    mapping(address => Deposit) public deposits;
    mapping(address => uint256) public collateral;
    uint256 public interestRate; // Annual interest rate in percentage
    uint256 public collateralizationRatio; // Collateralization ratio in percentage

    constructor(uint256 _interestRate, uint256 _collateralizationRatio) {
        interestRate = _interestRate;
        collateralizationRatio = _collateralizationRatio;
    }

    modifier onlyPositive(uint256 amount) {
        require(amount > 0, "Amount must be positive");
        _;
    }

    function deposit() external payable onlyPositive(msg.value) {
        deposits[msg.sender].amount += msg.value;
        deposits[msg.sender].depositTime = block.timestamp;

        emit EvDeposit(msg.value, msg.sender, block.timestamp);
    }

    function withdraw(uint256 amount) external onlyPositive(amount) {
        require(deposits[msg.sender].amount >= amount, "Insufficient balance");
        uint256 interest = calculateInterest(msg.sender);
        deposits[msg.sender].amount -= amount;
        payable(msg.sender).transfer(amount + interest);
    }

    function provideCollateral() external payable onlyPositive(msg.value) {
        collateral[msg.sender] += msg.value;

        emit ProvideCollateral(msg.sender, msg.value);
    }

    function borrow(uint256 amount) external onlyPositive(amount) {
        uint256 maxBorrow = collateral[msg.sender] * collateralizationRatio / 100;
        require(amount <= maxBorrow, "Insufficient collateral");
        payable(msg.sender).transfer(amount);

        emit Borrow(amount, msg.sender);
    }

    function repay() external payable onlyPositive(msg.value) {
        collateral[msg.sender] -= msg.value;
        uint totalCollateralAmount = getCollateralBalance(msg.sender);

        emit Repay(msg.sender, msg.value, totalCollateralAmount);
    }

    function calculateInterest(address user) internal view returns (uint256) {
        uint256 depositAmount = deposits[user].amount;
        uint256 depositDuration = block.timestamp - deposits[user].depositTime;
        uint256 interest = depositAmount * interestRate * depositDuration / (365 days * 100);
        return interest;
    }

    function getDepositBalance(address user) external view returns (uint256) {
        uint256 interest = calculateInterest(user);
        return deposits[user].amount + interest;
    }

    function getCollateralBalance(address user) public view returns (uint256) {
        return collateral[user];
    }
}
