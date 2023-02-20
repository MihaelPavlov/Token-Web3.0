import { ethers } from "hardhat";
import "../artifacts/contracts/CarCollection.sol/CarCollection.json";

export async function main() {
  // const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', ethers.provider); // New wallet with the privateKey passed from CLI as param
  // const NFT_factory = await ethers.getContractFactory("NFT");
  // console.log("Deploying contracts with the account:", wallet.address); // We are printing the address of the deployer
  // const nft = await NFT_factory.connect(wallet).deploy();
  // await nft.deployed();
  // console.log(`The NFT contract is deployed to ${nft.address}`);

  // const uri = 'https://ipfs.io/ipfs/QmPhCofVZxPGGpmxfrpuHojM5htT79A8Rrvb5piS2hmPmb';
  // await nft.safeMint(uri, wallet.address);
  // const uriFromContract = await nft.tokenURI(1);
  // console.log("The toke URI is ", uriFromContract);

  // const owner = await nft.ownerOf(1);
  // console.log("The owner of the token with id 1 is ", owner);
  const [owner, addr1] = await ethers.getSigners();

  const carCollection = await ethers.getContractFactory("CarCollection");

  // Owner and Addr1 if we deploy to testnet this should be public keys 
  const cars = await carCollection.deploy([owner.address, addr1.address], [80, 20]);// specifty the payes , and the shares

  await cars.deployed();

  console.log("Car Collection is deployed to:", cars.address);
}
// We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
