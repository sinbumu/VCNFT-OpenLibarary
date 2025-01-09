# VCNFT Open Library

이 프로젝트는 클라이언트, 이슈어, 베리파이어의 기능을 제공하는 **NFT 관리 라이브러리**입니다. 스마트 컨트랙트를 기반으로 민팅, 검증, 서명 기능을 수행하며, 유닛 테스트를 통해 각 기능을 검증합니다.

---

## 📂 **프로젝트 구조**

```plaintext
VCNFT-OpenLibrary/
├── src/                   # 라이브러리 소스 코드
│   ├── Client.ts          # 메시지 서명 및 해시 기능 제공
│   ├── Issuer.ts          # NFT 민팅 및 해시 생성 기능
│   └── Verifier.ts        # NFT 검증 기능 (ClaimHash 검증 등)
│
├── test/                  # 유닛 테스트 코드
│   ├── 01_Issuer.test.ts  # Issuer 기능 테스트
│   ├── 02_Verifier.test.ts # Verifier 기능 테스트 (패스워드 없는 경우)
│   ├── 03_Verifier_Password.test.ts # Verifier 기능 테스트 (패스워드 있는 경우)
│   └── Client.test.ts     # Client 기능 테스트
│
├── .env                   # 환경 변수 파일
└── README.md              # 프로젝트 가이드
```

---

## 🚀 **기능 설명**

### 1. **Client** (`src/Client.ts`)
- **역할**: 메시지 서명 및 메시지 해시를 생성합니다.  
- **주요 메서드**:  
  - `signMessage(message: string)`: 메시지를 받아 서명과 해시를 반환합니다.

---

### 2. **Issuer** (`src/Issuer.ts`)
- **역할**: NFT를 민팅하고 Claim 데이터를 해시화하는 기능을 제공합니다.  
- **주요 메서드**:
  - `generateHash(claimData: object)`: Claim 데이터를 JSON 문자열로 변환하고 해시를 생성합니다.
  - `mintToken(privateKey: string, request: MintRequest)`: ERC-721 컨트랙트에 NFT를 민팅합니다.

---

### 3. **Verifier** (`src/Verifier.ts`)
- **역할**: NFT 검증 기능을 수행합니다.
- **주요 기능**:  
  - **ClaimHash 검증**: 컨트랙트의 ClaimHash와 실제 데이터를 비교합니다.
  - **서명 검증**: 유저가 제공한 서명이 올바른지 확인합니다.
  - **패스워드 처리**: URI에 패스워드를 포함하여 검증할 수 있도록 유연하게 처리합니다.

---

## ⚙️ **환경 변수 설정**

모든 환경 변수는 프로젝트 루트의 `.env` 파일에 설정됩니다. 아래와 같은 구조로 작성해 주세요.

```plaintext
# 클라이언트의 개인키 (메시지 서명 시 사용)
CLIENT_PRIVATE_KEY=<PK>

# 이슈어의 개인키 (NFT 민팅 시 사용)
ISSUER_PRIVATE_KEY=<PK>

# 잘못된 개인키 (서명 검증 실패를 위한 테스트용)
WRONG_PRIVATE_KEY=<PK>

# 스마트 컨트랙트 주소
CONTRACT_ADDRESS=<ADDRESS>

# ABI 파일 경로
ABI_PATH=src/abi/VCNFT.json

# 테스트용 Token ID
TOKEN_ID=123456
```

### 환경 변수 설명:
1. **CLIENT_PRIVATE_KEY**: 클라이언트 서명 생성에 사용하는 개인키.  
2. **ISSUER_PRIVATE_KEY**: 토큰을 발급(민팅)할 때 사용하는 이슈어의 개인키.  
3. **WRONG_PRIVATE_KEY**: 검증 실패 시나리오를 테스트할 때 사용하는 잘못된 개인키.  
4. **CONTRACT_ADDRESS**: ERC-721 스마트 컨트랙트 주소.  
5. **ABI_PATH**: 컨트랙트 ABI(JSON 파일)의 경로.  
6. **TOKEN_ID**: 테스트에 사용되는 NFT의 고유 ID.

---

## 🧪 **유닛 테스트 실행**

유닛 테스트는 `jest`를 사용하여 작성되었으며, 다음 명령어로 실행할 수 있습니다:

```bash
npm test
```

### **유닛 테스트 설명**
1. **`01_Issuer.test.ts`**:  
   - NFT 민팅 및 ClaimHash 생성 기능을 테스트합니다.  
2. **`02_Verifier.test.ts`**:  
   - 패스워드가 없는 상태에서 검증 기능을 테스트합니다.  
   - 잘못된 서명이 전달될 경우 검증이 실패하는지 확인합니다.  
3. **`03_Verifier_Password.test.ts`**:  
   - 패스워드가 포함된 URI를 검증하는 기능을 테스트합니다.  
4. **`Client.test.ts`**:  
   - 메시지 서명 및 해시 생성 기능을 테스트합니다.

---

## 📦 **설치 및 실행 방법**

### 1. **의존성 설치**
```bash
npm install
```

### 2. **환경 변수 설정**
`.env` 파일을 생성하고 필요한 변수를 입력합니다.

### 3. **테스트 실행**
```bash
npm test
```
### 유닛 테스트 주의 사항
현재 해당 프로젝트의 컨트랙트등은 오픈소스로 공개되어 있지 않은데, 유닛테스트를 정상동작 시키려면 특정 체인네트워크나 로컬 가니쉬 등에 컨트랙트를 배포한 상태여야 됨. 

따라서 제 3자는 유닛테스트 불가능한 상태, (추후 정말 npm에 오픈소스 라이브러리로 업로드 할때 이부분도 mock 해버리거나, evm계열 퍼블릭 네트워크에 컨트랙트를 배포해둘 생각)

---

## 📜 **라이선스**
이 프로젝트는 MIT 라이선스를 따릅니다.  
자유롭게 수정 및 배포할 수 있으며, 원 저작자의 명시를 부탁드립니다.

---

이 가이드를 바탕으로 프로젝트를 실행하고 이해하는 데 큰 어려움이 없을 것입니다!  
혹시 추가하거나 수정할 부분이 있다면 언제든 말씀해주세요. 🚀