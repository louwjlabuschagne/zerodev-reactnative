# ZeroDev Magic and JWT Integration

## Installation

### Install the dependencies

```bash
npm i
```

### Polyfill the TextEncoder and TextDecoder

Before you can run the app we need to polyfill `TextEncoder` and `TextDecoder` in the `node_modules/viem/dist/cjs/utils/encoding/toHex.js` file. This is because the `TextEncoder` and `TextDecoder` are not available in the React Native environment.

open `node_modules/viem/dist/cjs/utils/encoding/toHex.js` and change the file from

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToHex = exports.numberToHex = exports.bytesToHex = exports.boolToHex = exports.toHex = void 0;
...
```

to

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextEncodingPolyfill = require("text-encoding");
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});
exports.stringToHex = exports.numberToHex = exports.bytesToHex = exports.boolToHex = exports.toHex = void 0;
...
```

adding

```js
const TextEncodingPolyfill = require("text-encoding");
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});
```
### Add your keys
Add your `POLYGON_RPC_URL`, `MAGIC_API_KEY`, `ZERO_DEV_PROJECT_ID`, and `INFURA_API_KEY` to the `utils/config.js` file.

```js
export const POLYGON_RPC_URL = "";
export const MAGIC_API_KEY = ""; 
export const ZERO_DEV_PROJECT_ID = "";
export const INFURA_API_KEY = ""; 
```

### Run the app

```bash
npx expo run:ios
```
