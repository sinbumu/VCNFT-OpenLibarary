// 03_Verifier_Password.test.ts
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

describe('Verifier (With Password)', () => {
  const contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
  const abiPath = process.env.ABI_PATH || path.resolve(__dirname, '../src/abi/VCNFT.json');
  const tokenId = process.env.TOKEN_ID || '12357';
  const challenge = 'Test challenge';
  const password = 'mypassword123'; // 테스트용 비밀번호

  const verifier = new Verifier(contractAddress, abiPath);

  const web3 = new Web3();
  const privateKey = process.env.CLIENT_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';
  const { signature } = web3.eth.accounts.sign(challenge, privateKey);

  beforeAll(() => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { title: 'Test Claim', content: 'This is a test claim' },
    });
  });

  it('should create a Verifier instance', () => {
    expect(verifier).toBeDefined();
  });

  it('should verify a token with password', async () => {
    const request = {
      tokenId,
      challenge,
      signature,
      password,
    };

    const isValid = await verifier.verifyToken(request);
    expect(isValid).toBe(true);
  });
});
