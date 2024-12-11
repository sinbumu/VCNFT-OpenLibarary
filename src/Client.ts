const Web3 = require('web3');

export class Client {
  private web3: any;
  private account: any;

  constructor(privateKey: string) {
    this.web3 = new Web3();
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  public signMessage(message: string): any {
    return this.account.sign(message);
  }
}