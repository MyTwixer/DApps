// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DeBorrowing {

    struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 interest;
        uint256 duration;
        uint256 startTime;
        address borrower;
        address lender;
        bool repaid;
    }

    uint256 public loanCounter;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;

    event LoanRequested(uint256 loanId, address borrower, uint256 amount, uint256 collateral, uint256 interest, uint256 duration);
    event LoanFunded(uint256 loanId, address lender);
    event LoanRepaid(uint256 loanId);

    modifier onlyBorrower(uint256 loanId) {
        require(msg.sender == loans[loanId].borrower, "Only the borrower can perform this action");
        _;
    }

    modifier onlyLender(uint256 loanId) {
        require(msg.sender == loans[loanId].lender, "Only the lender can perform this action");
        _;
    }

    modifier loanExists(uint256 loanId) {
        require(loanId < loanCounter, "Loan does not exist");
        _;
    }

    function requestLoan(uint256 amount, uint256 collateral, uint256 interest, uint256 duration) external payable {
        require(msg.value == collateral, "Collateral must be provided");
        
        loans[loanCounter] = Loan({
            amount: amount,
            collateral: collateral,
            interest: interest,
            duration: duration,
            startTime: 0,
            borrower: msg.sender,
            lender: address(0),
            repaid: false
        });

        borrowerLoans[msg.sender].push(loanCounter);

        emit LoanRequested(loanCounter, msg.sender, amount, collateral, interest, duration);

        loanCounter++;
    }

    function fundLoan(uint256 loanId) external payable loanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.lender == address(0), "Loan already funded");
        require(msg.value == loan.amount, "Incorrect loan amount");

        loan.lender = msg.sender;
        loan.startTime = block.timestamp;
        lenderLoans[msg.sender].push(loanId);

        payable(loan.borrower).transfer(loan.amount);

        emit LoanFunded(loanId, msg.sender);
    }

    function repayLoan(uint256 loanId) external payable onlyBorrower(loanId) loanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp <= loan.startTime + loan.duration, "Loan duration has passed");

        uint256 repaymentAmount = loan.amount + (loan.amount * loan.interest / 100);
        require(msg.value == repaymentAmount, "Incorrect repayment amount");

        loan.repaid = true;

        payable(loan.lender).transfer(repaymentAmount);
        payable(loan.borrower).transfer(loan.collateral);

        emit LoanRepaid(loanId);
    }

    function claimCollateral(uint256 loanId) external onlyLender(loanId) loanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp > loan.startTime + loan.duration, "Loan duration has not passed");

        payable(loan.lender).transfer(loan.collateral);

        loan.repaid = true;
    }

    function getBorrowerLoans(address borrower) external view returns (uint256[] memory) {
        return borrowerLoans[borrower];
    }

    function getLenderLoans(address lender) external view returns (uint256[] memory) {
        return lenderLoans[lender];
    }
}
