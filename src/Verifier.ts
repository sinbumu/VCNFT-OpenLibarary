import * as fs from 'fs';
import Web3 from 'web3';
import axios from 'axios';

interface VerificationRequest {
  tokenId: string;
  challenge: string;
  signature: string;
}

export class Verifier {
  private web3: any;
  private contract: any;

  constructor(contractAddress: string, abiPath: string) {
    this.web3 = new Web3('http://127.0.0.1:8545');
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
  }

  public async verifyToken(request: VerificationRequest): Promise<boolean> {
    const credential = await this.contract.methods.credential(request.tokenId).call();
    const { ClaimHash, ClaimURI } = credential;

    const response = await axios.get(ClaimURI);
    const claimData = response.data;
    const computedHash = this.web3.utils.sha3(JSON.stringify(claimData));

    if (computedHash !== ClaimHash) {
      throw new Error('ClaimHash does not match');
    }

    const recoveredAddress = this.web3.eth.accounts.recover(request.challenge, request.signature);
    const ownerAddress = await this.contract.methods.ownerOf(request.tokenId).call();

    return recoveredAddress.toLowerCase() === ownerAddress.toLowerCase();
  }
}
