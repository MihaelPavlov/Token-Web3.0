const ethers = require("ethers");
const CarCollection = require("../artifacts/contracts/CarCollection.sol/CarCollection.json");
require('dotenv').config();

const run = async function () {
    const provider = new ethers.providers.InfuraProvider("goerli", "31d722098d4e48929c96519ba339b2d0")
    const wallet = new ethers.Wallet("a61ded91802937b4690567a62077f2cca4cb1342a9be3cd69fd81689ad349c04", provider);
    const balance = await wallet.getBalance();
    console.log(ethers.utils.formatEther(balance, 18))

    const contractAddress = "0x45F5b1CFAd6A5abe58eE369DDf064dcD2576C5EF";
    const contract = new ethers.Contract(contractAddress, CarCollection.abi, wallet)
    const state= await contract.mint(2,1,{ value: ethers.utils.parseEther("0.01"), gasLimit: 10000000 });
    await state.wait();

    await contract.withdraw("0x2e13A23B3b738906FAEc3EF92e52D608Dda4575B");
}
run();