const fs = require('fs');
const Web3 = require('web3');

if(!fs.existsSync('dtwitter.sol.json')) {
  const solc = require('solc');
  const input = fs.readFileSync('dtwitter.sol', {encoding: 'utf8'});
  const output = solc.compile(input, 1);

  fs.writeFileSync('dtwitter.sol.json', JSON.stringify(output));
}

const output = JSON.parse(fs.readFileSync('dtwitter.sol.json', {encoding: 'utf8'}));
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8555"));
// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8546"));
web3.transactionConfirmationBlocks = 1;

const compiled = output.contracts[':DTwitter'];
const interface = JSON.parse(compiled.interface);

web3.eth.getAccounts().then((accounts) => {
  web3.eth.defaultAccount = accounts[0];
  console.log(`DEFAULT AZCCOUNT: ${web3.eth.defaultAccount}`);

  const defaultOptions = {
    from: web3.eth.defaultAccount,
    gas: 1500000,
    gasPrice: '30000000000000'
  };

  console.log("Deploying contract...");
  new web3.eth.Contract(interface)
    .deploy(Object.assign({data: `0x${compiled.bytecode}`}, defaultOptions))
    .send(defaultOptions)
    .on('error', (err) => { console.log(`ERROR: ${err}`); })
    .on('transactionHash', (txHash) => { console.log(`TX HASH: ${txHash}`); })
    .on('receipt', (receipt) => { console.log(`RECEIPT: ${receipt}`); })
    .on('confirmation', (confirmationNumber, receipt) => { console.log(`CONFIRMATION: ${confirmationNumber}, ${receipt}`); })
    .then((Twitter) => {
      console.log("Deployed contract.");
      console.log("Creating account...");
      Twitter
        .methods
        .createAccount('superdealloc', 'Just a guy who wants to chill.')
        .send(defaultOptions)
        .on('error', (err) => { console.log(`ERROR: ${err}`); })
        .on('transactionHash', (txHash) => { console.log(`TX HASH: ${txHash}`); })
        .on('receipt', (receipt) => { console.log(`RECEIPT: ${receipt}`); })
        .on('confirmation', (confirmationNumber, receipt) => { console.log(`CONFIRMATION: ${confirmationNumber}, ${receipt}`); })
        .then(() => {
          console.log("Created account.");
          Twitter
            .methods
            .users(web3.utils.keccak256('superdealloc'))
            .call()
            .then((user) => {
              console.log(`superdealloc ${user && 'exists' || 'does not exist'}`);
            });
        });

      // Uncommenting this next section will unlock the top transaction, but locks this one.
      if(false) {
        Twitter
          .methods
          .createAccount('iurimatias', 'Just another dude.')
          .send(defaultOptions);
      }
    });
});


