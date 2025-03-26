// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// contract ClaimVault is Ownable, Pausable {
//     IERC20 public token;
//     IERC721 public nft;
//     bytes32 public merkleRoot;
//     uint256 public claimStart;
//     uint256 public claimEnd;
//     mapping(address => bool) public claimed;

//     event StandardClaim(address indexed claimant, uint256 amount);
//     event BonusClaim(address indexed claimant, uint256 bonusAmount);

//     constructor(
//         address tokenAddress,
//         address nftAddress,
//         bytes32 _merkleRoot,
//         uint256 _claimStart,
//         uint256 _claimEnd
//     ) {
//         token = IERC20(tokenAddress);
//         nft = IERC721(nftAddress);
//         merkleRoot = _merkleRoot;
//         claimStart = _claimStart;
//         claimEnd = _claimEnd;
//     }

//     modifier withinClaimWindow() {
//         require(block.timestamp >= claimStart && block.timestamp <= claimEnd, "Not in claim window");
//         _;
//     }
//     modifier notClaimed() {
//         require(!claimed[msg.sender], "Already claimed");
//         _;
//     }

//     function claim(uint256 amount, bytes32[] calldata proof)
//         external
//         whenNotPaused
//         withinClaimWindow
//         notClaimed
//     {
//         require(nft.balanceOf(msg.sender) > 0, "Must own NFT");
//         claimed[msg.sender] = true;
//         require(token.transfer(msg.sender, amount), "Transfer failed");

//         if (proof.length > 0) {
//             bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
//             if (MerkleProof.verify(proof, merkleRoot, leaf)) {
//                 uint256 bonus = amount / 2;
//                 require(token.transfer(msg.sender, bonus), "Bonus transfer failed");
//                 emit BonusClaim(msg.sender, bonus);
//             }
//         }
//         emit StandardClaim(msg.sender, amount);
//     }

//     function setMerkleRoot(bytes32 newRoot) external onlyOwner {
//         merkleRoot = newRoot;
//     }
//     function setClaimWindow(uint256 s, uint256 e) external onlyOwner {
//         claimStart = s;
//         claimEnd = e;
//     }
//     function pause() external onlyOwner { _pause(); }
//     function unpause() external onlyOwner { _unpause(); }
//     function withdrawUnclaimedTokens(address to, uint256 amount) external onlyOwner {
//         require(token.transfer(to, amount), "Withdraw failed");
//     }
// }
