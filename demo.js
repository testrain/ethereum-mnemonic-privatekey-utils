const pkutils = require('./index');

pkutils.debug = true;

const mnemonic = 'yesterday once more happy bride smile short lovers make life sound great';
const password = 'this is a totally long password';

console.log('mnemonic               : %s', mnemonic);
console.log('password               : %s', password);

const privateKeyGenList = pkutils.getPrivateKeysFromMnemonic(mnemonic, 10);

const keystores = pkutils.getKeystoresFromPrivateKey(privateKeyGenList, password);


// const privateKeyParsed = pkutils.getPrivateKeyFromKeystore(keystore, password);
// console.log('pkey from keystore     : 0x%s', privateKeyParsed);

// const account = keystore.address;
// console.log('account address        : 0x%s', account);
