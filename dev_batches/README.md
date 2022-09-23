## Batch files for dev on Windows

윈도우 사용자용 개발시 더블클릭으로만으로 편하게 프론트, 백 돌리라고 만든 거

기존에 IDE 에서, 또는 알아서 잘 돌리던 사람들은 굳이 안 써도 됨

### Prerequisites

- Docker Desktop 이 실행되어 있어야 함
- backend 컨테이너 한정, MySQL 이 실행되어 있어야 함 (b106 DB, root, root)

### Batches

- 한 번이라도 all 이나 build 를 한 컨테이너에 대해서는 이후에 run 만 해도 돌아감
- 소스가 변경되었다면 all 이나 build 를 해야 변경사항이 반영됨

| file         | description                              |
| ------------ | ---------------------------------------- |
| front-\*.bat | frontend 컨테이너                        |
| back-\*.bat  | backend 컨테이너                         |
| \*-all.bat   | 빌드, 실행 모두 함                       |
| \*-build.bat | 빌드만 함                                |
| \*-run.bat   | 실행만 함 (기존에 빌드가 되어 있어야 함) |
| \*-stop.bat  | 실행중인 컨테이너를 중단함               |

### Containers

| container | port | profile   |
| --------- | ---- | --------- |
| backend   | 8080 | devdocker |
| frontend  | 3000 | default   |