var keythereum = require("keythereum");
var datadir = "/Users/andremedeiros/src/_sandbox/embark_demo/.embark/development/datadir";
var address= "0x00a329c0648769A73afAc7F9381E08FB43dBEA72";
const password = "";

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));
