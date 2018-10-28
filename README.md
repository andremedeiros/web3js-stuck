# Websocket stuck replication

This small project is a proof-of-concept that replicates the behaviour where WS connections get stuck on transactions in the latest web3.js version.

## How to run

### Geth

```
$ geth --ws --wsorigins='*' --dev --networkid=4
```

### Node

```
$ npm i
$ node index.js
```