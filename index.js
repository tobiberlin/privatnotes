/**
 * @file
 * The main file for the private note app
 */

const express = require('express')
const app = express()
const { encrypt, decrypt } = require('./app/crypto')
const {createUniqueFilename, getPrivateUrl, getAbsoluteFilePath} = require('./app/fileshandling');
const fs = require('fs')
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./templates');
let twing = new TwingEnvironment(loader);

// get the configuration from the local .env file
const dotenv = require('dotenv');
dotenv.config();

/**
 * Call the frontpage: show form
 */
app.get('/', (req, res) => {
  twing.render('form.twig', {
    'headline': process.env.STRING_HOME_HEADLINE,
    'description': process.env.STRING_HOME_DESCRIPION,
    'button_text': process.env.STRING_HOME_BUTTON
  }).then((output) => {
    res.end(output);
  });
})

/**
 * Call the frontpage after sending form:
 *  - store crypted message as json
 *  - show link to message
 */
app.post('/', express.urlencoded({extended: true}), (req, res) => {
  let message = req.body.message,
    crypted = encrypt(message),
    fileContent = JSON.stringify(crypted),
    filename = createUniqueFilename();

  fs.writeFile(getAbsoluteFilePath(filename), fileContent, err => {
    if (err) {
      twing.render('error.twig', {
        'error': err.message,
        'headline': process.env.STRING_ERROR_HEADLINE
      }).then((output) => {
        res.end(output);
      });
    }
    let messageUrl = getPrivateUrl(filename);
    twing.render('showlink.twig', {
      'headline': process.env.STRING_SHOW_LINK_HEADLINE,
      'description': process.env.STRING_SHOW_LINK_DESCRIPTION,
      'button_text': process.env.STRING_SHOW_LINK_COPY_LINK_BUTTON,
      'link': messageUrl}).then((output) => {
      res.end(output);
    });
  });
})

/**
 * URL to see the message
 *  - load JSON
 *  - delete file
 *  - show decrypted message
 */
app.get('/message', (req, res) => {
  let fileName = req.query.id + '.json',
  filePath = process.env.NOTES_STORAGE + fileName;

  try {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath , function(err, data) {
        if (err)
          throw err
        fs.unlink(filePath, (err) => {
          if (err)
            throw err
        })

        let encryptedMessage = JSON.parse(data);
        let message = decrypt(encryptedMessage);
        twing.render('shownote.twig', {
          'headline': process.env.STRING_SHOW_NOTE_HEADLINE,
          'deleted_message': process.env.STRING_SHOW_NOTE_DELETED,
          'message' : message
        }).then((output) => {
          res.end(output);
        });

      });
    }
    else {
      twing.render('nomessage.twig', {'headline': process.env.STRING_NO_MESSAGE_HEADLINE}).then((output) => {
        res.end(output);
      });
    }
  } catch(err) {
    twing.render('error.twig', {
      'error': err.message,
      'headline': process.env.STRING_ERROR_HEADLINE
    }).then((output) => {
      res.end(output);
    });
  }
})

app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT)