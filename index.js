const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');
const keythereum = require('keythereum');

exports.debug = false;

function getPrivateKeysFromMnemonic(mnemonic, num=1) {
	const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(mnemonic));
	const wallet_hdpath = "m/44'/60'/0'/0/";
  let pkList = [];

  for (let i = 0; i < num; i++) {
	  const wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
	  const privateKey = wallet._privKey.toString('hex');
    pkList.push(privateKey);
	  const account = '0x' + wallet.getAddress().toString('hex').toUpperCase();

	  if (exports.debug) {
		  console.log("privateKey: %s \naccount: %s\n", privateKey, account);
    }
  }
	return pkList;
}

exports.getPrivateKeysFromMnemonic = getPrivateKeysFromMnemonic;

function getPrivateKeyFromRandom() {
	const params = { keyBytes: 32, ivBytes: 16 };
	const dk = keythereum.create(params);

	const privateKey = dk.privateKey.toString('hex');

	if (exports.debug)
		console.log({
			privateKey: privateKey,
			salt: dk.salt.toString('hex'),
			iv: dk.iv.toString('hex')
		});

	return privateKey;
}

exports.getPrivateKeyFromRandom = getPrivateKeyFromRandom;

function getPrivateKeyFromKeystore(keystore, password) {
	const privateKeyBuf = keythereum.recover(password, keystore);
	const privateKey = privateKeyBuf.toString('hex');

	if (exports.debug)
		console.log({
			privateKey: privateKey,
			password: password,
			keystore: keystore
		});

	return privateKey;
}

exports.getPrivateKeyFromKeystore = getPrivateKeyFromKeystore;

function getKeystoresFromPrivateKey(privateKeyList, password) {
	const params = { keyBytes: 32, ivBytes: 16 };
	const dk = keythereum.create(params);
	const options = {
		kdf: 'pbkdf2',
		cipher: 'aes-128-ctr',
		kdfparams: {
			c: 262144,
			dklen: 32,
			prf: 'hmac-sha256'
		}
	};

  let keystoreList = [];
	for (let i = 0; i < privateKeyList.length; i++) {
    // const keystore = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);
	  const keystore = keythereum.dump(password, privateKeyList[i], dk.salt, dk.iv, options);
    keystoreList.push(keystore);

	  if (exports.debug) {
		  console.log("keystore: %j\n", keystore);
	  }
  }
	return keystoreList;
}

exports.getKeystoresFromPrivateKey = getKeystoresFromPrivateKey;
