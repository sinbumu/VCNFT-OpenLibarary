const Web3 = require('web3');
const fs = require('fs');

interface MintRequest {
  to: string;
  tokenId: string;
  uri: string;
  claimHash: string;
  issuanceTime: number;
  expirationTime: number;
  optionalData: string;
}

export class Issuer {
  private web3: any;
  private account: any;
  private contract: any;

  constructor(privateKey: string, contractAddress: string, abiPath: string) {
    this.web3 = new Web3('http://127.0.0.1:8545');
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
  }

  public async mintToken(privateKey: string, request: MintRequest): Promise<any> {
    const tx = this.contract.methods.certify(
      request.to,
      request.tokenId,
      request.uri,
      request.claimHash,
      0, // Default parentTokenId
      request.issuanceTime,
      request.expirationTime,
      request.optionalData
    );

    const gas = await tx.estimateGas({ from: this.account.address });
    const txData = tx.encodeABI();

    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: this.contract.options.address,
        data: txData,
        gas,
      },
      privateKey
    );

    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }
}