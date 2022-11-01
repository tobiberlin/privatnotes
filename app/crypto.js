/**
 * @file
 * Logic to encrypt and decrypt a private note
 */

const crypto = require('crypto')
// get the configuration from the local .env file
const dotenv = require('dotenv');
dotenv.config();
const CRYPTO_ENCODING = 'hex';

/**
 * The encryption method
 *
 * @param private_note
 *  The private note which should encrypted
 *
 * @returns {{iv: string, content: string}}
 */
const encrypt = private_note => {
  let iv = crypto.randomBytes(+process.env.CRYPTO_RANDOM_BYTES),
    cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET_KEY, iv),
    encrypted = Buffer.concat([cipher.update(private_note), cipher.final()]);

  return {
    iv: iv.toString(CRYPTO_ENCODING),
    content: encrypted.toString(CRYPTO_ENCODING)
  }
}

/**
 * The method to decrypt the private note as stored locally
 * @param hash
 * @returns {string}
 */
const decrypt = hash => {
  let decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET_KEY, Buffer.from(hash.iv, CRYPTO_ENCODING)),
    decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, CRYPTO_ENCODING)), decipher.final()]);

  return decrpyted.toString()
}

module.exports = {
  encrypt,
  decrypt
}