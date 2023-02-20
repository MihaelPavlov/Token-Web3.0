import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("CarCollection contract", function () {
    let contract: any;
    let owner: any;
    let addr1: any;
    let addr2: any;
    let addrs: any;

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        const CarCollection = await ethers.getContractFactory("CarCollection");
        contract = await CarCollection.deploy(
            [owner.address, addr1.address, addr2.address],
            [40, 30, 30]
        );

        await contract.deployed();

        await contract.setAllowList([addr1.address]);
    });

    it("should have a mintPrice of 0.02 ether", async function () {
        const price = await contract.mintPrice();
        expect(price).to.equal(ethers.utils.parseEther("0.02"));
    });

    it("should have an allowListPrice of 0.01 ether", async function () {
        const price = await contract.allowListPrice();
        expect(price).to.equal(ethers.utils.parseEther("0.01"));
    });

    it("should not allow public minting when publicMintOpen is false", async function () {
        await expect(
            contract.publicMint(1, 1, { value: ethers.utils.parseEther("0.02") })
        ).to.be.revertedWith("Public mint is closed");
    });

    it("should allow public minting when publicMintOpen is true", async function () {
        await contract.editMintWindows(true, true);

        const balanceBefore = await ethers.provider.getBalance(owner.address);
        const tx = await contract.publicMint(1, 1, { value: ethers.utils.parseEther("0.02") });
        const result = await tx.wait();
        const gasUsed = result.gasUsed.mul(await tx.gasPrice);
        const balanceAfter = await ethers.provider.getBalance(owner.address);

        expect(balanceAfter).to.equal(balanceBefore.sub(gasUsed).sub(ethers.utils.parseEther("0.02")));
    });

    it("should not allow allowList minting when allowListMintOpen is false", async function () {
        await contract.editMintWindows(false, false);

        await expect(
            contract.allowListMint(1, 1, { value: ethers.utils.parseEther("0.01") })
        ).to.be.revertedWith("Allow list mint is closed");
    });

    it("should allow allowList minting when allowListMintOpen is true", async function () {
        await contract.editMintWindows(true, true);

        const balanceBefore = await ethers.provider.getBalance(addr1.address);
        const tx = await contract.connect(addr1).allowListMint(1, 1, { value: ethers.utils.parseEther("0.01") });
        const result = await tx.wait();
        const gasUsed = result.gasUsed.mul(await tx.gasPrice);
        const balanceAfter = await ethers.provider.getBalance(addr1.address);

        expect(balanceAfter).to.equal(balanceBefore.sub(gasUsed).sub(ethers.utils.parseEther("0.01")));
    });

    it("should not allow allowList minting for addresses not on allowList", async function () {
        await expect(
            contract.connect(addrs[0]).allowListMint(1, 1, { value: ethers.utils.parseEther("0.01") })
        ).to.be.revertedWith("You are not on the allowList");
    });
});