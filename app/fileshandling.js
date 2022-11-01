/**
 * @file
 * Logic to store private notes locally
 */

const {randomString} = require('./helpers');
const path = require('path')
const fs = require('fs')
const baseUrl = 'http://localhost:3000';
// get the configuration
const dotenv = require('dotenv');
dotenv.config();

/**
 * Create a unique file name for storing the private note locally
 *
 * @returns {string}
 */
const createUniqueFilename = function() {
  let filename = randomString(25);
  if (fs.existsSync(getAbsoluteFilePath(filename))) {
    return createUniqueFilename()
  }

  return filename;
}

/**
 * Get the absolute local file path
 *
 * @param filename
 * @returns {string}
 */
const getAbsoluteFilePath = filename => path.resolve(process.env.NOTES_STORAGE + filename + '.json');

/**
 * Create the link for showing the private note
 *
 * @param filename
 * @returns {string}
 */
const getPrivateNoteUrl = filename => baseUrl + '/message?id=' + filename;


module.exports = {
  createUniqueFilename: createUniqueFilename,
  getPrivateUrl : getPrivateNoteUrl,
  getAbsoluteFilePath : getAbsoluteFilePath
}