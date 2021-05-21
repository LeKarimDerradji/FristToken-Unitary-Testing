const { expect } = require('chai')

describe('FirstToken', function () {
  let FirstToken, firsttoken, dev, owner, alice, bob, charlie, dan, eve
  const NAME = 'FirstToken'
  const SYMBOL = 'FTN'
  const INITIAL_SUPPLY = ethers.utils.parseEther('8000000000')
  const TRANSFER_SUPPLY = ethers.utils.parseEther('1000000000')

  beforeEach(async function () {
    ;[dev, owner, alice, bob, charlie, dan, eve] = await ethers.getSigners()
    FirstToken = await ethers.getContractFactory('FirstToken')
    firsttoken = await FirstToken.connect(dev).deploy(owner.address, INITIAL_SUPPLY)
    await firsttoken.deployed()
    /*
    Il faudra transférer des tokens à nos utilisateurs de tests lorsque la fonction transfer sera implementé
    await firsttoken
      .connect(owner)
      .transfer(alice.address, ethers.utils.parseEther('100000000'))
      */
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
        
      /*
      Pb de récupération de l'event d'une transaction passée avec Waffle: Sofiane s'en occupe
      await expect(
        FirstToken.connect(dev).deploy(
          owner.address,
          ethers.utils.parseEther('8000000000')
        )
      ).to.emit(, 'Transfer').withArgs(ethers.constants.AddressZero, owner.address, ethers.utils.parseEther('8000000000'));
      */
    })
  })

  describe('Allowance system', function () {
    // Tester le système d'allowance ici
  })
  describe('Token transfers', function () {
    beforeEach(async function () {
        expect(await firsttoken.connect(owner).transfer(alice.address, TRANSFER_SUPPLY))
    })
    it('transfers tokens from sender to receipient', async function () {
        await firsttoken.connect(alice).transfer(bob.address, TRANSFER_SUPPLY)
        expect(await firsttoken.balanceOf(bob.address)).to.equal(TRANSFER_SUPPLY)
    })
    it('allowance of ammount of tokens from sender to spender', async function () {
        await firsttoken.connect(alice).allowance(bob.address, TRANSFER_SUPPLY)
        expect(await firsttoken.allowanceOf(alice.address, bob.address)).to.equal(TRANSFER_SUPPLY)
    })
    it('transferFrom tokens from sender to recipient', async function () {
        await firsttoken.connect(alice).allowance(bob.address, TRANSFER_SUPPLY)
        await firsttoken.connect(bob).transferFrom(alice.address, eve.address, TRANSFER_SUPPLY)
        expect(await firsttoken.balanceOf(eve.address)).to.equal(TRANSFER_SUPPLY)
    })
    it('emits event Transfer when transfer token', async function () {
        await expect(firsttoken.connect(alice).transfer(bob.address, TRANSFER_SUPPLY))
        .to.emit(firsttoken, 'Transfer')
        .withArgs(alice.address, bob.address, TRANSFER_SUPPLY)
    })
    it('emits event Transfer when transferFrom token', async function () {
        await firsttoken.connect(alice).allowance(bob.address, TRANSFER_SUPPLY)
        await expect(firsttoken.connect(bob).transferFrom(alice.address, eve.address, TRANSFER_SUPPLY))
        .to.emit(firsttoken, 'Transfer')
        .withArgs(alice.address, eve.address, TRANSFER_SUPPLY)
    })
  })
})