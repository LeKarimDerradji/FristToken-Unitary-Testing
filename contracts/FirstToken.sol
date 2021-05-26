// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract FirstToken {

    mapping(address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowed;

    mapping(address => bool) private _allowances;

    string private _name;
    string private _symbol; 

    uint256 private _totalSupply;
    uint8 private _decimals; 

    event Transfer(address indexed sender, address indexed receipient, uint256 amount);
    event Approval(address indexed sender, address indexed spender_, uint256 addedValue);

    constructor(address owner_, uint256 totalSupply_) {
        _name = 'FirstToken';
        _symbol = 'FTN';
        _totalSupply = totalSupply_;
        _balances[owner_] = _totalSupply;
        emit Transfer(address(0), owner_, _totalSupply);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function allowanceOf(address owner_, address spender_) public view returns (uint256 remaining) {
        return _allowed[owner_][spender_];
    }

    function transfer(address to_, uint256 value_) public returns (bool success) {
        require(value_ <= _balances[msg.sender], 'FirstToken : msg.sender doesnt possess the amount');
        require(to_ != address(0), 'FirstToken : msg.sender must not be the address 0');

        _balances[msg.sender] -= value_;
        _balances[to_] += value_;
        emit Transfer(msg.sender, to_, value_);
        return true;
    }

    function transferFrom(address from_, address to_, uint256 value_) public returns (bool success) {
        require(value_ <= _balances[from_], 'FirstToken: balance of spender insuficient');
        require(value_ <= _allowed[from_][msg.sender], 'FirstToken: allowed balance is insuficient');
        require(to_ != address(0), 'FirstToken : can send funds to address ZERO');

        _balances[from_] -= value_;
        _balances[to_] += value_;
        _allowed[from_][msg.sender] -= value_;
        emit Transfer(from_, to_, value_);
        return true;
    }

    function approve(address spender_, uint256 addedValue_) public returns (bool success) {
        require(spender_ != address(0));

        _allowed[msg.sender][spender_] = addedValue_;
        emit Approval(msg.sender, spender_, _allowed[msg.sender][spender_]);
        return true;
  }

}
