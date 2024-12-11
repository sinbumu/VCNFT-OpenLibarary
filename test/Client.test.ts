import { Client } from '../src/Client';

describe('Client', () => {
  const privateKey = '0x1f1bc684d51170a0a74f96bdb406f52b03a94a95c3bbdd789173afb35589530a';
  const client = new Client(privateKey);

  it('should sign a message', () => {
    const message = 'Test message';
    const signature = client.signMessage(message);
    expect(signature).toHaveProperty('signature');
    expect(signature).toHaveProperty('messageHash');
    expect(signature).toHaveProperty('v');
  });
});
