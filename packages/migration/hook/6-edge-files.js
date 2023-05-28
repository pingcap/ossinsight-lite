const {webcrypto} = require('node:crypto')
module.exports.before_migration = async () => {
  const {privateKey, publicKey} = await webcrypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  process.env.PRI_KEY = JSON.stringify(await webcrypto.subtle.exportKey('jwk', privateKey))
  process.env.PUB_KEY = JSON.stringify(await webcrypto.subtle.exportKey('jwk', publicKey))
}