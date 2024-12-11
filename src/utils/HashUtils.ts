import Web3 from 'web3';

export class Web3Utils {
  private web3: Web3;

  constructor(providerUrl: string = 'http://127.0.0.1:8545') {
    this.web3 = new Web3(providerUrl);
  }

  public recoverAddress(message: string, signature: string): string {
    return this.web3.eth.accounts.recover(message, signature);
  }

  public hashData(data: any): string {
    return this.web3.utils.sha3(JSON.stringify(data)) as string;
  }

  public toChecksumAddress(address: string): string {
    return this.web3.utils.toChecksumAddress(address);
  }
}
