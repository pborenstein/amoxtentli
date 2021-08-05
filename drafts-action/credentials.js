// credentials.js

const credential = Credential.create("amoxtentli", "Credentials for tool to post to a repo");

credential.addTextField('username', 'GitHub user name');
credential.addPasswordField('key', "GitHub access token");

credential.authorize();

const githubUser = credential.getValue('username');
const githubKey  = credential.getValue('key');
