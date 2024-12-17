import Web3 from 'web3';
import * as fs from 'fs';

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

  /**
   * Issuer 클래스 생성자
   * @param privateKey - 개인키
   * @param contractAddress - 스마트 컨트랙트 주소
   * @param abiPath - ABI 파일 경로
   * @param rpcUrl - Web3 RPC URL (default: http://127.0.0.1:8545)
   * @param encoding - ABI 파일 읽기 시 사용할 인코딩 (default: 'utf-8')
   */
  constructor(
    privateKey: string,
    contractAddress: string,
    abiPath: string,
    rpcUrl: string = 'http://127.0.0.1:8545',
    encoding: BufferEncoding = 'utf-8'
  ) {
    this.web3 = new Web3(rpcUrl); // 외부에서 URL 설정 가능
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);

    // ABI 파일 읽기 (인코딩 옵션 추가)
    const fileContent = fs.readFileSync(abiPath, encoding);
    const abi = JSON.parse(fileContent);

    this.contract = new this.web3.eth.Contract(abi, contractAddress);
  }

  /**
   * Claim 데이터를 해시화하는 유틸리티 함수
   * @param claimData - 클레임 데이터 객체
   * @returns 해시값
   */
  public generateHash(claimData: object): string {
    return this.web3.utils.sha3(JSON.stringify(claimData));
  }

  /**
   * 토큰 민팅 함수
   * @param privateKey - 개인키
   * @param request - 민팅 요청 객체
   * @returns 트랜잭션 receipt
   */
  public async mintToken(privateKey: string, request: MintRequest): Promise<any> {
    // ERC-721 컨트랙트의 certify 함수 호출
    const tx = this.contract.methods.certify(
      request.to,
      request.tokenId,
      request.uri,
      request.claimHash,
      0, // 기본 parentTokenId
      request.issuanceTime,
      request.expirationTime,
      request.optionalData
    );

    // Gas estimation
    const gas = await tx.estimateGas({ from: this.account.address });
    const txData = tx.encodeABI();

    // 트랜잭션 데이터 구성
    const transaction = {
      from: this.account.address,
      to: this.contract.options.address,
      data: txData,
      gas,
    };

    // 트랜잭션 전송
    const receipt = await this.web3.eth.sendTransaction(transaction);
    return receipt;
  }
}
