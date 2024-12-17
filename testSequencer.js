const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // 테스트 파일 이름을 기준으로 정렬 (예: 숫자 순서로)
    return tests.sort((a, b) => a.path.localeCompare(b.path));
  }
}

module.exports = CustomSequencer;
