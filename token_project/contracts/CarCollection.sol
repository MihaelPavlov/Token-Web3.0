// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract CarCollection is
    ERC1155,
    Ownable,
    Pausable,
    ERC1155Supply,
    PaymentSplitter
{
    uint256 public constant BMW = 1;
    uint256 public constant AUDI = 2;
    uint256 public constant Toyota = 3;
    uint256 public maxSupply = 2;
    uint256 public mintPrice = 0.02 ether;
    uint256 public allowListPrice = 0.01 ether;
    uint256 public maxPerWallet = 3;

    bool public publicMintOpen = false;
    bool public allowListMintOpen = true;

    mapping(address => bool) allowList;
    mapping(address => uint256) purchasesPerWallet;

    constructor(address[] memory _payees, uint256[] memory _shares)
        ERC1155(
            "https://ipfs.io/ipfs/bafybeie4cdhlkhknezae2lghbs4obwglysjiyb56ebdgyqdfqocjlvidvq/"
        )
        PaymentSplitter(_payees, _shares)
    {
        _mint(msg.sender, BMW, 1, "");
        _mint(msg.sender, AUDI, 1, "");
        _mint(msg.sender, Toyota, 10**9, "");
    }

    function editMintWindows(bool _publicMintOpen, bool _allowListMintOpen)
        external
        onlyOwner
    {
        publicMintOpen = _publicMintOpen;
        allowListMintOpen = _allowListMintOpen;
    }

    function publicMint(uint256 id, uint256 amount) public payable {
        require(publicMintOpen, "Public mint is closed");
        require(msg.value == mintPrice * amount, "Not enough money send.");

        mint(id, amount);
    }

    function allowListMint(uint256 id, uint256 amount) public payable {
        require(allowListMintOpen, "Allow list mint is closed");
        require(msg.value == allowListPrice * amount, "Not enough money send.");
        require(allowList[msg.sender], "You are not on the allowList");

        mint(id, amount);
    }

    function mint(uint256 id, uint256 amount) internal {
        require(
            purchasesPerWallet[msg.sender] + amount <= maxPerWallet,
            "Wallet limit reached"
        );
        require(id < 4, "Sorry you are trying to min the wrong NFT");
        require(
            totalSupply(id) + amount <= maxSupply,
            "There is no more supply from the NFT. Minted out"
        );

        _mint(msg.sender, id, amount, "");
        purchasesPerWallet[msg.sender] += amount;
    }

    // If we use the PaymentSplitter the withdraw functions is not necessary.
    function withdraw(address _addr) external onlyOwner {
        uint256 balance = address(this).balance;
        payable(_addr).transfer(balance);
    }

    function setAllowList(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            allowList[addresses[i]] = true;
        }
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function uri(uint256 _id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(exists(_id), "URI: the token doesn't exist");

        return
            string(
                abi.encodePacked(super.uri(_id), Strings.toString(_id), ".json")
            );

        // return
        //     string(
        //         abi.encodePacked(
        //             "https://ipfs.io/ipfs/bafybeie4cdhlkhknezae2lghbs4obwglysjiyb56ebdgyqdfqocjlvidvq/",
        //             Strings.toString(_tokenid),
        //             ".json"
        //         )
        //     );
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
