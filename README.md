# Typescript Template

[![<rhea-so>](https://circleci.com/gh/rhea-so/Typescript.svg?style=svg)](<LINK>)
 
 Typescript Project를 만들때 걸리는 시간을 획기적으로 단축시키기 위한 Base Repository
 
## 제공하는 기능
 
### Docker Build

아래 명령어로 레퍼지토리를 바로 빌드할 수 있음

```sh
docker build --tag TAG:VERSION .
docker build --tag myserver:0.1 . // 예시
```

### NPM Module로 빌드해 배포 가능

아래 명령어로 레퍼지토리를 NPM Registry에 배포할 수 있음  
모듈 사용자들은 index.ts를 불러오게 됨  
참고로, 모듈로 만들어 배포하려는 경우 무조건 상대 경로로 코드를 짜야함. (아래 절대경로로 모듈 불러오기 기능 못씀)

```sh
tsc
npm publish
npm unpublish --force PACKAGE_NAME // 강제로 출시한 모듈을 완전 제거하고 싶은 경우
```

### 절대경로로 모듈 불러오기

index.ts에는 아래 코드가 들어있는데, 이 코드 덕분에 모듈들을 전부 절대경로로 불러올 수 있음

```typescript
require('app-module-path').addPath(__dirname); // 절대경로로 모듈을 불러 올 수 있도록 도와줌
require('source-map-support').install();

import { Debug, LogTag } from './Utils/debugTool'; // 상대경로 예시
import { Debug, LogTag } from 'Utils/debugTool'; // 절대경로 예시
```

### Pretty console.log for debug

알록달록하고 예쁘게 시간까지 포함해서 로그를 찍어줌  
아래 모듈을 사용하면 됨

```typescript
import { Debug, LogTag } from 'Utils/debugTool';

Debug.log(LogTag.NOWAY, 'Hello, World!');
```

### CircleCI

CircleCI에 등록, GitHub에 푸시만 하면 알아서 빌드 -> Mocha test까지 진행함

### TDD를 위한 Mocha + NPC

```sh
npm test # mocha test
npm run coverage # coverage 폴더에 테스트 결과를 정리해놓음 (테스트 커버리지 나옴)
```


## Support Git History

### Credits

Based on these amazing projects:

* rhea by [JeongHyeon Kim](https://github.com/rhea-so)

### License

none