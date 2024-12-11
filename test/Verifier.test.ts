import { Verifier } from '../src/Verifier';
import axios from 'axios';
import fs from 'fs';

jest.mock('fs');
jest.mock('axios');

describe('Verifier', () => {
  const contractAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const abiPath = './src/abi/VCNFT.json';
  const mockAbi = [{ name: 'credential', inputs: [], outputs: [] }];

  beforeAll(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockAbi));
  });

  const verifier = new Verifier(contractAddress, abiPath);

  it('should create a Verifier instance', () => {
    expect(verifier).toBeDefined();
  });

  it('should verify a token', async () => {
    const request = {
      tokenId: '12345',
      challenge: 'Test challenge',
      signature: '0xabcdef1234567890',
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: { title: 'Test Claim' } });

    const isValid = await verifier.verifyToken(request);
    expect(isValid).toBe(true);
  });
});
