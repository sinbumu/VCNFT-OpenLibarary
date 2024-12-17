import { Client } from '../src/Client';
import * as dotenv from 'dotenv';

dotenv.config(); // 환경 변수 불러오기

describe('Client', () => {
  // 환경 변수에서 Client의 privateKey를 가져오고, 없으면 기본값 사용
  const clientPrivateKey =
    process.env.CLIENT_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

  if (!process.env.CLIENT_PRIVATE_KEY) {
    console.warn(
      'Warning: No CLIENT_PRIVATE_KEY found in environment variables. Using default test private key.'
    );
  }

  // 클라이언트 인스턴스 생성
  const client = new Client(clientPrivateKey);

  it('should sign a message', () => {
    const message = 'Test message';
    const signature = client.signMessage(message);

    expect(signature).toHaveProperty('signature');
    expect(signature).toHaveProperty('messageHash');
    expect(signature).toHaveProperty('v');
  });
});
