const { BigNumber } = require('@ethersproject/bignumber')
const { expect } = require('chai')

describe('FirstToken', function () {
  let FirstToken, firsttoken, dev, owner, alice, bob, charlie, dan, eve
  const NAME = 'FirstToken'
  const SYMBOL = 'FTN'
  const INITIAL_SUPPLY = ethers.utils.parseEther('8000000000')
  const TRANSFER_SUPPLY = ethers.utils.parseEther('1000000000')

  // Execute before each "it" functions
  beforeEach(async function () {
    ;[dev, owner, alice, bob, charlie, dan, eve] = await ethers.getSigners()
    FirstToken = await ethers.getContractFactory('FirstToken')
    firsttoken = await FirstToken.connect(dev).deploy(owner.address, INITIAL_SUPPLY)
    await firsttoken.deployed() // Await for the first block to be mined
    // Await for the owner to transfer the initial supply to Alice, by default, dev will do the transfer, but he doesn't
    // possess the funds. 
    await firsttoken
      .connect(owner)
      .transfer(alice.address, TRANSFER_SUPPLY)
  })

  describe('Deployement', function () {
    it('Has name FirstToken', async function () {
      expect(await firsttoken.name()).to.equal(NAME)
    })
    it('Has symbol FTN', async function () {
      expect(await firsttoken.symbol()).to.equal(SYMBOL)
    })
    it('mints initial Supply to owner', async function () {
      let firsttoken = await FirstToken.connect(dev).deploy(
        owner.address,
        INITIAL_SUPPLY
      )
      expect(await firsttoken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY)
    })

    it('emits event Transfer when mint totalSupply', async function () {

        let receipt = await firsttoken.deployTransaction.wait()
        let txHash = receipt.transactionHash
        await expect(txHash)
          .to.emit(firsttoken, 'Transfer')
          .withArgs(ethers.constants.AddressZero, owner.address, INITIAL_SUPPLY)
    })
  })

  describe('Token transfers', function () {
    it('transfers tokens from sender to receipient', async function () {
        await firsttoken.connect(alice).transfer(bob.address, TRANSFER_SUPPLY)
        expect(await firsttoken.balanceOf(bob.address)).to.equal(TRANSFER_SUPPLY)
    })
    it('allowance of ammount of tokens from sender to spender', async function () {
        await firsttoken.connect(alice).approve(bob.address, TRANSFER_SUPPLY)
        expect(await firsttoken.allowanceOf(alice.address, bob.address)).to.equal(TRANSFER_SUPPLY)
    })
    it('transferFrom tokens from sender to recipient', async function () {
        await firsttoken.connect(alice).approve(bob.address, TRANSFER_SUPPLY)
        await firsttoken.connect(bob).transferFrom(alice.address, eve.address, TRANSFER_SUPPLY)
        expect(await firsttoken.balanceOf(eve.address)).to.equal(TRANSFER_SUPPLY)
    })
    it('emits event Transfer when transfer token', async function () {
        await expect(firsttoken.connect(alice).transfer(bob.address, TRANSFER_SUPPLY))
        .to.emit(firsttoken, 'Transfer')
        .withArgs(alice.address, bob.address, TRANSFER_SUPPLY)
    })
    it('emits event Transfer when transferFrom token', async function () {
        await firsttoken.connect(alice).approve(bob.address, TRANSFER_SUPPLY)
        await expect(firsttoken.connect(bob).transferFrom(alice.address, eve.address, TRANSFER_SUPPLY))
        .to.emit(firsttoken, 'Transfer')
        .withArgs(alice.address, eve.address, TRANSFER_SUPPLY)
    })
    it('revert when funds transfered are above the balances of msg.sender', async function () {
        await expect(firsttoken.connect(alice).transfer(bob.address, ethers.utils.parseEther('10000000000')))
        .to.be.revertedWith('FirstToken : msg.sender doesnt possess the amount')
    })
    it('revert with BALANCE OF SPENDER IS INSUFICIENT', async function () {
        await firsttoken.connect(alice).approve(bob.address, TRANSFER_SUPPLY)
        expect(firsttoken.connect(bob).transferFrom(alice.address, eve.address, ethers.utils.parseEther('10000000000')))
        .to.be.revertedWith('FirstToken: balance of spender insuficient')
    })
    // revert when allowed balance is insuficient

    // revert transfer from address zero
    it('revert with CAN NOT TRANSFER FROM ADDRESS ZERO', async function () {
        await firsttoken.connect(alice).approve(bob.address, TRANSFER_SUPPLY)
        expect(firsttoken.connect(bob).transferFrom(alice.address, ethers.constants.AddressZero, TRANSFER_SUPPLY))
        .to.be.revertedWith('FirstToken : can send funds to address ZERO')
    })
})
})
