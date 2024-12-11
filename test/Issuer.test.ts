import { Issuer } from '../src/Issuer';
import fs from 'fs';

jest.mock('fs');

describe('Issuer', () => {
  const privateKey = '0x1f1bc684d51170a0a74f96bdb406f52b03a94a95c3bbdd789173afb35589530a';
  const contractAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const abiPath = './src/abi/VCNFT.json';
  const mockAbi = [{ name: 'certify', inputs: [], outputs: [] }];

  beforeAll(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockAbi));
  });

  const issuer = new Issuer(privateKey, contractAddress, abiPath);

  it('should create an Issuer instance', () => {
    expect(issuer).toBeDefined();
  });

  it('should mint a token', async () => {
    const request = {
      to: '0x17D02C217cC867401dB61291e1253DbE579dB56e',
      tokenId: '12345',
      uri: 'http://example.com/claim',
      claimHash: '0xabcdef1234567890',
      issuanceTime: 1697788800,
      expirationTime: 1729324800,
      optionalData: 'Test data',
    };
    const receipt = await issuer.mintToken(privateKey, request);
    expect(receipt).toHaveProperty('transactionHash');
  });
});
