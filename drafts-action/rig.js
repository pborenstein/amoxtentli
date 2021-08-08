// credentials.js

const credential = Credential.create("amoxtentli", "Credentials for tool to post to a repo");

credential.addTextField('username', 'GitHub user name');
credential.addPasswordField('key', "GitHub access token");

credential.authorize();

const githubUser = credential.getValue('username');
const githubKey  = credential.getValue('key');

// prompt.js

//  trim leading & trailing whitespace
//  determine whether it's a one-liner

draft.content = draft.content.trim()
const fOneline = (draft.lines.length == 1)


//  set up the prompt according to the rules
//  for one-line drafts

const prompt  = Prompt.create()

prompt.title    = 'Post this draft'
prompt.message  = ''

prompt.addTextField('title',    'Title',    fOneline == 1
                                            ? "✼ ✼ ✼"
                                            : draft.displayTitle)
prompt.addTextView( 'summary',  'Summary',  fOneline == 1
                                            ? draft.content
                                            : draft.bodyPreview(240))

prompt.addSwitch(     'newlines', 'Preserve newlines',  false)
prompt.addSwitch(     'trim',     'Trim first line',    true)
prompt.addTextField(  'repo',     'Repo name',          'amoxtentli')
prompt.addTextField(  'path',     'Repo path',          'src/posts')

prompt.addButton('OK',      'OK',     true)
prompt.addButton('Delete',  'delete', false)

if (!prompt.show()) {
	context.cancel()
}

const prompt_title      = prompt.fieldValues['title']
const prompt_repo       = prompt.fieldValues['repo']
const prompt_repoPath   = prompt.fieldValues['path']
const prompt_newlines   = prompt.fieldValues['newlines']
const prompt_trim       = prompt.fieldValues['trim']
const prompt_summary    = prompt.fieldValues['summary']
const prompt_deletePost = prompt.buttonPressed == 'delete'


// https://forums.getdrafts.com/t/script-step-post-to-github-without-working-copy/3594

function pad(n) {
  let str = String(n)
  while (str.length < 2) {
    str = `0${str}`
  }
  return str
}


//   time stamps

const postTime      = new Date()
const draftTime     = draft.createdAt

//  files and path

const fileName      = `${draft.uuid.toLowerCase()}.md`
const postURL       = `https://api.github.com/repos/${githubUser}/${prompt_repo}/contents/${prompt_repoPath}/${fileName}`

//   front matter stuff

const fm_date       = postTime.toISOString()
const fm_draftDate  = draftTime.toISOString()
const fm_title      = prompt_title
const fm_draft      = draft.permalink
const fm_summary    = prompt_summary.replace(/"/g, '\\"')
const fm_content    = fOneline ? fm_summary : draft.lines.slice(prompt_trim ? 1 : 0).join('\n')

const postContent = `---
title: ${fm_title}
date: ${fm_date}
draftDate: ${fm_draftDate}
draft: ${fm_draft}
trim: ${prompt_trim}
newlines: ${prompt_newlines}
postURL: ${postURL}
summary: "${fm_summary}"
---

${fm_content}
`

function getSHA(http, path) {
  let response = http.request({ method: 'GET',
                                url: path })

  console.log(`** getSHA: response.statusCode: ${response.statusCode}`)

  if (response.statusCode == 404) {
      // file doesn't exist
    return ""
  } else if (response.statusCode == 200) {
      //  the file exists, so get its sha
    let parsedResponseText = JSON.parse(response.responseText)
    console.log('** getSHA parsedResponseText')
    console.log(JSON.stringify(parsedResponseText, null, 2))
    return parsedResponseText.sha
  }

  //  something strange happened :shrug:
  context.cancel()
  app.displayErrorMessage(`getSHA statusCode (${response.statusCode})`)
}


let http = HTTP.create()

let sha = getSHA(http, postURL)

request = {
  url: postURL,
  method: prompt_deletePost ? 'DELETE' : 'PUT',
  headers: {
    Authorization: `token ${githubKey}`,
    Accept: 'application/vnd.github.v3+json'
  },
  data: {
    message: `note ${prompt_deletePost ? 'deleted' : 'posted'} at ${postTime}`,
    content: prompt_deletePost ? '' :  Base64.encode(postContent),
    branch: 'main',
    sha: sha
  }
}

console.log('** REQUEST')
console.log(JSON.stringify(request, null, 2))

let response = http.request(request)

console.log('** RESPONSE')

console.log(`response.error: ${response.error}`)
console.log(`response.headers: ${JSON.stringify(response.headers, null, 2)}`)
console.log(`response.otherData: ${response.otherData}`)
console.log(`response.responseData: ${response.responseData}`)
console.log(`response.responseText: ${response.responseText}`)
console.log(`response.statusCode: ${response.statusCode}`)
console.log(`response.success: ${response.success}`)


if (response.statusCode <= 250) {
  app.displaySuccessMessage('Posted')
} else {
  app.displayErrorMessage(`Something went wrong (${response.statusCode})`)
}
