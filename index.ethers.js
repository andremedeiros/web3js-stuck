const fs = require('fs');
const ethers = require('ethers');
const Web3 = require('web3');

if(!fs.existsSync('dtwitter.sol.json')) {
  const solc = require('solc');
  const input = fs.readFileSync('dtwitter.sol', {encoding: 'utf8'});
  const output = solc.compile(input, 1);

  fs.writeFileSync('dtwitter.sol.json', JSON.stringify(output));
}

const output = JSON.parse(fs.readFileSync('dtwitter.sol.json', {encoding: 'utf8'}));
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const compiled = output.contracts[':DTwitter'];
const interface = JSON.parse(compiled.interface);

const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
const defaultAccount = "0x00a329c0648769A73afAc7F9381E08FB43dBEA72";
const defaultOptions = {
  from: defaultAccount,
  gas: 1500000,
  gasPrice: '30000000000000'
};

console.log("Deploying contract...");
let wallet = ethers.Wallet.fromMnemonic('example exile argue silk regular smile grass bomb merge arm assist farm');
wallet = wallet.connect(provider);
// console.log('Wallet???', wallet);
let contractFactory = new ethers.ContractFactory(interface, compiled.bytecode, wallet);
let contract = contractFactory.deploy(function() {
  console.log('yeehaw');
}).then(async contract => {
  console.log(contract.address);
  // "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E"

  // The transaction that was sent to the network to deploy the Contract
  // See: https://ropsten.etherscan.io/tx/0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51
  console.log(contract.deployTransaction.hash);
  // "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51"

  // The contract is NOT deployed yet; we must wait until it is mined
  await contract.deployed()
  console.log('Alright');


  let contractWithSigner = contract.connect(wallet);
// ... OR ...
// let contractWithSigner = new Contract(contractAddress, abi, wallet)

// Set a new Value, which returns the transaction
  let tx = await contractWithSigner.createAccount('superdealloc', 'Just a guy who wants to chill.');

// See: https://ropsten.etherscan.io/tx/0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364
  console.log(tx.hash);
// "0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364"

// The operation is NOT complete yet; we must wait until it is mined
  await tx.wait();

  console.log('OK', tx);
// Call the Contract's getValue() method again
//   let newValue = await contract.users(Web3.utils.keccak256('superdealloc'));

  // console.log(newValue);
});

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));

/*
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

*/

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
