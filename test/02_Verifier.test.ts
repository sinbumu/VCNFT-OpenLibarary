import { Verifier } from '../src/Verifier';
import Web3 from 'web3';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('axios');

beforeAll(async () => {
  // 민팅 후 충분한 대기 시간을 줌
  await new Promise((resolve) => setTimeout(resolve, 2000));
});

describe('Verifier (No Password)', () => {
  const contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
  const abiPath = process.env.ABI_PATH || path.resolve(__dirname, '../src/abi/VCNFT.json');
  const tokenId = process.env.TOKEN_ID || '12357';
  const challenge = 'Test challenge';

  const verifier = new Verifier(contractAddress, abiPath);

  // 올바른 Private Key
  const web3 = new Web3();
  const correctPrivateKey = process.env.CLIENT_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';
  const { signature: validSignature } = web3.eth.accounts.sign(challenge, correctPrivateKey);

  // 잘못된 Private Key
  const wrongPrivateKey = process.env.WRONG_PRIVATE_KEY || '0x1111111111111111111111111111111111111111111111111111111111111111';
  const { signature: invalidSignature } = web3.eth.accounts.sign(challenge, wrongPrivateKey);

  beforeAll(() => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { title: 'Test Claim', content: 'This is a test claim' },
    });
  });

  it('should create a Verifier instance', () => {
    expect(verifier).toBeDefined();
  });

  it('should verify a token successfully with a valid signature', async () => {
    const request = {
      tokenId,
      challenge,
      signature: validSignature, // 올바른 서명
    };

    const isValid = await verifier.verifyToken(request);
    expect(isValid).toBe(true);
  });

  it('should fail to verify a token with an invalid signature', async () => {
    const request = {
      tokenId,
      challenge,
      signature: invalidSignature, // 잘못된 서명
    };

    await expect(verifier.verifyToken(request)).rejects.toThrow('Signature verification failed');
  });

  it('should fail verification when ClaimHash does not match', async () => {
    // Axios에서 잘못된 데이터를 반환하도록 설정
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { title: 'Incorrect Claim', content: 'This is an invalid claim' },
    });

    const request = {
      tokenId,
      challenge,
      signature: validSignature, // 올바른 서명
    };

    await expect(verifier.verifyToken(request)).rejects.toThrow('ClaimHash does not match');
  });
});
