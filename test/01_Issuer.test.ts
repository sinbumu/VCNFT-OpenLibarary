import { Issuer } from '../src/Issuer';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // 환경변수 로드

describe('Issuer', () => {
  // .env에서 환경변수를 가져오거나 기본값 사용
  const privateKey = process.env.ISSUER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';
  const contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
  const abiPath = process.env.ABI_PATH || path.resolve(__dirname, '../src/abi/VCNFT.json');
  const tokenId = process.env.TOKEN_ID || '12357'; // tokenId도 환경변수에서 가져옴

  const dummyClaim = { title: 'Test Claim', content: 'This is a test claim' };

  const issuer = new Issuer(privateKey, contractAddress, abiPath);

  it('should create an Issuer instance', () => {
    expect(issuer).toBeDefined();
  });

  it('should generate a hash for Claim data', () => {
    const hash = issuer.generateHash(dummyClaim);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
  });

  it('should mint a token', async () => {
    const request = {
      to: '0xef4A1767B6EBAe35571a816BaA6De6e71D494513',
      tokenId,
      uri: 'http://example.com/claim',
      claimHash: issuer.generateHash(dummyClaim),
      issuanceTime: 1697788800,
      expirationTime: 1729324800,
      optionalData: 'Test optional data',
    };

    const receipt = await issuer.mintToken(privateKey, request);
    expect(receipt).toHaveProperty('transactionHash');
  });
});
