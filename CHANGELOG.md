# 🐐 Goat It API Versioning Changelog

## [1.2.0](https://github.com/antoinezanardi/goat-it-api/compare/v1.1.0...v1.2.0) (2025-10-20)

### 🚀 Features

* **docker:** add multi-stage Dockerfile for development and production ([#40](https://github.com/antoinezanardi/goat-it-api/issues/40)) ([d33782a](https://github.com/antoinezanardi/goat-it-api/commit/d33782a4f063c3606582adb2724bcfcac71e02a1))
* **stryker:** add mutation testing configuration and scripts ([#36](https://github.com/antoinezanardi/goat-it-api/issues/36)) ([08ff38d](https://github.com/antoinezanardi/goat-it-api/commit/08ff38d3bf8c65c98c8bb501404b6c28b6f046af))

### 🔁 CI

* **docker:** configure staging environment for Docker image ([#44](https://github.com/antoinezanardi/goat-it-api/issues/44)) ([6f14ebc](https://github.com/antoinezanardi/goat-it-api/commit/6f14ebc3083ddb911b717c31b9cd59138b224864))

### 🧹 Chore

* **deps:** update actions/checkout action to v5 ([#42](https://github.com/antoinezanardi/goat-it-api/issues/42)) ([9350db2](https://github.com/antoinezanardi/goat-it-api/commit/9350db2484c93144ec50239d4e2e4d71bbf3a1ed))
* **deps:** update actions/download-artifact action to v5 ([#43](https://github.com/antoinezanardi/goat-it-api/issues/43)) ([2eb485c](https://github.com/antoinezanardi/goat-it-api/commit/2eb485c1e4031567c0d3f7ca55133152f184040f))
* **deps:** update actions/setup-node action to v6 ([#17](https://github.com/antoinezanardi/goat-it-api/issues/17)) ([9411428](https://github.com/antoinezanardi/goat-it-api/commit/9411428b1fbb098f8fadc02f7710b0c59ea4c682))
* **deps:** update dependency @types/node to ^24.8.0 ([#34](https://github.com/antoinezanardi/goat-it-api/issues/34)) ([896ec08](https://github.com/antoinezanardi/goat-it-api/commit/896ec083fdbd0cfd4fda01eef2755f4aa444c259))
* **deps:** update dependency @types/node to ^24.8.1 ([#35](https://github.com/antoinezanardi/goat-it-api/issues/35)) ([f3da93f](https://github.com/antoinezanardi/goat-it-api/commit/f3da93f3ace48a0ab87e9c106e8480d3e1d2313c))
* **deps:** update dependency @types/node to ^24.9.0 ([#41](https://github.com/antoinezanardi/goat-it-api/issues/41)) ([47c1a66](https://github.com/antoinezanardi/goat-it-api/commit/47c1a665663c9ea5eec793175e7c676acdc40272))
* **deps:** update dependency semantic-release to ^25.0.1 ([#38](https://github.com/antoinezanardi/goat-it-api/issues/38)) ([f7c4f84](https://github.com/antoinezanardi/goat-it-api/commit/f7c4f843d033ce33ba6d01bcde943ed6f2a32821))
* **deps:** update dependency semantic-release to v25 ([#32](https://github.com/antoinezanardi/goat-it-api/issues/32)) ([d55d3e9](https://github.com/antoinezanardi/goat-it-api/commit/d55d3e9cd8c83324e7dff4fb211c8308628c66e1))
* **deps:** update dependency unplugin-swc to ^1.5.8 ([#39](https://github.com/antoinezanardi/goat-it-api/issues/39)) ([1bfb533](https://github.com/antoinezanardi/goat-it-api/commit/1bfb533e387557c92adf6d5f917b741c29f82a6e))
* **deps:** update node.js to >=24.10.0 ([#37](https://github.com/antoinezanardi/goat-it-api/issues/37)) ([a0bdb0b](https://github.com/antoinezanardi/goat-it-api/commit/a0bdb0bb167473decf4f8445cfedc4c543249986))
* **deps:** update pnpm to v10.18.3 ([#18](https://github.com/antoinezanardi/goat-it-api/issues/18)) ([8179562](https://github.com/antoinezanardi/goat-it-api/commit/8179562d562ae451a431c10725cd1e5dc39d5a0c))

## [1.1.0](https://github.com/antoinezanardi/goat-it-api/compare/v1.0.0...v1.1.0) (2025-10-13)

### 🚀 Features

* **app:** initialize NestJS application with basic structure ([#8](https://github.com/antoinezanardi/goat-it-api/issues/8)) ([e166056](https://github.com/antoinezanardi/goat-it-api/commit/e1660560b3c631b55ab97fcdd203ed1650c0315b))
* **tests:** add initial Vitest configuration and server tests ([#11](https://github.com/antoinezanardi/goat-it-api/issues/11)) ([e9912e1](https://github.com/antoinezanardi/goat-it-api/commit/e9912e1136aaca69dedb7e74d03fd11af461e747))
* **tests:** add vitest coverage configuration ([#14](https://github.com/antoinezanardi/goat-it-api/issues/14)) ([75e2a8b](https://github.com/antoinezanardi/goat-it-api/commit/75e2a8bc40529a84fbf765160bd409a2dfdd7eb3))

### 🔩 Refactor

* **imports:** move app files to dedicated directory ([#16](https://github.com/antoinezanardi/goat-it-api/issues/16)) ([8627619](https://github.com/antoinezanardi/goat-it-api/commit/862761944f10e73356aa3ad4ca07731568147d2d))
* **paths:** update import paths to use aliases ([#15](https://github.com/antoinezanardi/goat-it-api/issues/15)) ([53675aa](https://github.com/antoinezanardi/goat-it-api/commit/53675aa31274aadf2b93157b21fd6879f67064f6))

### 🔁 CI

* **action:** add build verification step and update main entry point ([#13](https://github.com/antoinezanardi/goat-it-api/issues/13)) ([7e40499](https://github.com/antoinezanardi/goat-it-api/commit/7e40499c7c14f7cabed1970dd42c7289e9755ca2))

### 🧹 Chore

* **config:** reorganize configuration files and update paths ([#12](https://github.com/antoinezanardi/goat-it-api/issues/12)) ([96632cd](https://github.com/antoinezanardi/goat-it-api/commit/96632cdca6f450e17019b3bac68f183618c9f1a7))
* **package:** add conventional-changelog-conventionalcommits dependency ([#10](https://github.com/antoinezanardi/goat-it-api/issues/10)) ([cf95e3e](https://github.com/antoinezanardi/goat-it-api/commit/cf95e3e4fb3b93a1685814f10919883ee5efda96))

## 1.0.0 (2025-10-12)

* ci(release): add release creation workflow with CodeQL analysis (#7) ([2739561](https://github.com/antoinezanardi/goat-it-api/commit/2739561)), closes [#7](https://github.com/antoinezanardi/goat-it-api/issues/7)
* chore: add husky and commitlint configuration files (#4) ([3faf5ff](https://github.com/antoinezanardi/goat-it-api/commit/3faf5ff)), closes [#4](https://github.com/antoinezanardi/goat-it-api/issues/4)
* chore: add initial project configuration files ([25e5c84](https://github.com/antoinezanardi/goat-it-api/commit/25e5c84))
* chore(release): add semantic release configuration and workflow (#5) ([a1c6290](https://github.com/antoinezanardi/goat-it-api/commit/a1c6290)), closes [#5](https://github.com/antoinezanardi/goat-it-api/issues/5)
* Initial commit ([5c02a8f](https://github.com/antoinezanardi/goat-it-api/commit/5c02a8f))
* Release v1.0.0 (#6) ([b2ed2df](https://github.com/antoinezanardi/goat-it-api/commit/b2ed2df)), closes [#6](https://github.com/antoinezanardi/goat-it-api/issues/6)
* fix(scripts): improve base branch fetching and error handling (#3) ([effbeed](https://github.com/antoinezanardi/goat-it-api/commit/effbeed)), closes [#3](https://github.com/antoinezanardi/goat-it-api/issues/3)
* feat(scripts): add interactive scripts for branch and PR management (#2) ([9cf9e97](https://github.com/antoinezanardi/goat-it-api/commit/9cf9e97)), closes [#2](https://github.com/antoinezanardi/goat-it-api/issues/2)
