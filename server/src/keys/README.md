# Be sure to change **_ALL_** the files in this directory.

`email-secret.key.js` - This is used by the server to create the token for a user to change their password via email and the "forgot password" dialog.  Set this to something unique.

`smtp-auth.user.js` - This is used by the server to authenticate to the SMTP server when attempting to send the above email.  Change this to valid SMTP credentials.

`jwtRS256.key.*` - These two files need to be regenerated and then transformed.  First, to regenerate them use the following:

* `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key`
* * Note: Don't add a passphrase*
* `openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`

Now transform the files.  Use the existing .js default files as a go-by.  Note you need to add the .js extension, then edit to add a backslash at the end of each line, putting the entire key into the variable "`key`" and then exporting that.  Note the line breaks as well with `\n` - these are important.

Once you have all the files in this directory changed, you'll want to move them into the `config/keys` subdirectory for the docker image.  Note - this is the config directory on the host which should be added as a volume in the docker run command with the -v option.  Something like `-v \<path\>/config:/homesite/config`.  See the docker image setup instructions for more details.