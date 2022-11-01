# About

This is my first attempt to use node.js. It is a simple tool which let you send private notes like passwords by just giving a link to the receiver of the note. In this way you do not need to send passwords via e-mail or any messenger (what you do not do anyway I hope).

Built with node.js and Twig as a render engine (as I am originally a PHP developer I liked to have some known syntax here).

# How it works

- the sender fills in the password or the private note into a form in the browser
- this toll then stores the filled in data crypted locally and give the user a link
- this link is given to the receiver of the private note
- the receiver then sees the private note and the note itself is deleted

# How to start
- download the code
- create a local .env file (see .env.default for all needed configurations)
- run `npm ci` to get the needed packages
- run `node index.js`