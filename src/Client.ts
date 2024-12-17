import Web3 from 'web3';

export class Client {
  private web3: any;
  private account: any;

  /**
   * Client 클래스 생성자
   * @param privateKey - 개인키
   */
  constructor(privateKey: string) {
    this.web3 = new Web3();
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  public signMessage(message: string): any {
    return this.account.sign(message);
  }
}