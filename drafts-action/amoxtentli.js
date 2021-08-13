// amoxtentli.js


// tad-meta.js
// extracted from ThoughtAsylum's TADpole library
//  !!! be sure to set tadLib.metaPath to point to
//      somewhere in Draft's iCloud folder
//      like  /Library/Scripts/config.json
// ------------------------------------------------------------
// Merge data for the draft from the custom meta data file into the custom meta data for the draft.


Draft.prototype.TA_metaRead = function()
{
    //Initialise from file
    let fmCloud = FileManager.createCloud();
    let objMeta = fmCloud.readJSON(tadLib.metaPath);

    //Prime any non-existent data structures
    if (this.meta === undefined) this.meta = {};
    if (objMeta === undefined) objMeta = {};
    if (objMeta[this.uuid] === undefined) objMeta[this.uuid] = {};

    //Merge the data in the JSON file to the data in the draft
    this.meta = Object.assign(this.meta, objMeta[this.uuid]);

    return;
}

// Replace the data for the draft in the custom meta data file with the custom meta data of the draft.
Draft.prototype.TA_metaWrite = function(doDelete)
{
    //Initialise from file
    let fmCloud = FileManager.createCloud();
    let objMeta = fmCloud.readJSON(tadLib.metaPath);

    //Prime any non-existent data structures
    if (this.meta === undefined) this.meta = {};
    if (objMeta === undefined) objMeta = {};
    if (objMeta[this.uuid] === undefined) objMeta[this.uuid] = {};

    //Replace the data in the object created from the data file with the draft data for that draft
    objMeta[this.uuid] = this.meta;

    //Write the object back to file
    fmCloud.writeJSON(tadLib.metaPath, objMeta);

    return;
}

Draft.prototype.TA_metaDelete = function() {

    let fmCloud = FileManager.createCloud();
    let objMeta = fmCloud.readJSON(tadLib.metaPath);

    delete objMeta[this.uuid];
    delete this.meta

    fmCloud.writeJSON(tadLib.metaPath, objMeta);

}


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
const  tadLib = {
  metaPath: '/Library/Scripts/amoxtentli/config.json'
}


draft.TA_metaRead()

let draftMetadata = draft.meta

//  set up the prompt according to the rules
//  for one-line drafts

const prompt  = Prompt.create()

prompt.title    = 'Post this draft'
prompt.message  = ''


//  titles have feelings
//
//  saved custom title
//  single line stars
//  display title

const stars = "✼ ✼ ✼"
let title = (draftMetadata && draftMetadata.title)
          ? draftMetadata.title
          : fOneline == 1
          ? stars
          : draft.displayTitle

//  summaries are complicated
//
//  selected text
//  saved custom summary
//  single line self-summary
//  240 characters

let selectedText = editor.getSelectedText()
let summary = selectedText
              ? selectedText
              : (draftMetadata && draftMetadata.summary)
              ? draftMetadata.summary
              : fOneline == 1
              ? draft.content
              : draft.bodyPreview(240)


prompt.addTextField('title',   'Title',   title)
prompt.addTextView( 'summary', 'Summary', summary)

prompt.addSwitch(     'newlines', 'Preserve newlines',  (draftMetadata && draftMetadata.newlines) || false)
prompt.addSwitch(     'trim',     'Trim first line',    (draftMetadata && draftMetadata.trim) || true)
prompt.addTextField(  'repo',     'Repo name',          'amoxtentli')
prompt.addTextField(  'path',     'Repo path',          'src/posts')

prompt.addButton('OK',      'OK',     true)
prompt.addButton('Delete',  'delete', false)

// https://forums.getdrafts.com/t/script-step-post-to-github-without-working-copy/3594

function pad(n) {
  let str = String(n)
  while (str.length < 2) {
    str = `0${str}`
  }
  return str
}

function getSHA(http, path) {
  let response = http.request({ method: 'GET',
                                url: path,
                                headers: {
                                  Authorization: `token ${githubKey}`,
                                  Accept: 'application/vnd.github.v3+json'
                                }
                              })

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

function doPost(http, request ) {

  let response = http.request(request)


  console.log('** RESPONSE')
  console.log(`response.error: ${response.error}`)
  console.log(`response.headers: ${JSON.stringify(response.headers, null, 2)}`)
  console.log(`response.otherData: ${response.otherData}`)
  console.log(`response.responseData: ${response.responseData}`)
  console.log(`response.responseText: ${response.responseText}`)
  console.log(`response.statusCode: ${response.statusCode}`)
  console.log(`response.success: ${response.success}`)

  return response.statusCode
}

//  --------------
//    M A I N
//  --------------

if (prompt.show()) {

    //  settings are the things we persist
  let settings = {
    title      : prompt.fieldValues['title'],
    repo       : prompt.fieldValues['repo'],
    repoPath   : prompt.fieldValues['path'],
    newlines   : prompt.fieldValues['newlines'],
    trim       : prompt.fieldValues['trim'],
    summary    : prompt.fieldValues['summary'],
  }

  const deletePost  = prompt.buttonPressed == 'delete'

    //   time stamps
  const postTime    = new Date()
  const draftTime   = draft.createdAt

    //  files and path
  const fileName    = `${draft.uuid.toLowerCase()}.md`
  const apiURL      = `https://api.github.com/repos/${githubUser}/${settings.repo}/contents/${settings.repoPath}/${fileName}`
  const githubURL   = `https://github.com/pborenstein/${settings.repo}/blob/main/${settings.repoPath}/${fileName}`

    //   front matter stuff
  const fm_summary  = settings.summary.replace(/"/g, '\\"')
  const fm_content  = fOneline ? fm_summary : draft.lines.slice(settings.trim ? 1 : 0).join('\n')



  const postContent = `---
title: ${settings.title}
date: ${postTime.toISOString()}
draftDate: ${draftTime.toISOString()}
draft: ${draft.permalink}
github: ${githubURL}
trim: ${settings.trim}
newlines: ${settings.newlines}
summary: "${fm_summary}"
---

${fm_content}
`


    // P O S T I N G

  let http = HTTP.create()
  let sha = getSHA(http, apiURL)

  let request = {
    url: apiURL,
    method: deletePost ? 'DELETE' : 'PUT',
    headers: {
      Authorization: `token ${githubKey}`,
      Accept: 'application/vnd.github.v3+json'
    },
    data: {
      message: `note ${deletePost ? 'deleted from' : 'posted to'} ${settings.repoPath}: ${postTime}`,
      content: deletePost ? '' :  Base64.encode(postContent),
      branch: 'main',
      sha: sha
    }
  }
  console.log('** REQUEST')
  console.log(JSON.stringify(request, null, 2))

  let postStatus = doPost(http, request)

  if (postStatus <= 250) {
    app.displaySuccessMessage(`Draft ${deletePost ? "deleted" : "posted" } on ${settings.repo} `)
  } else {
    app.displayErrorMessage(`Something went wrong (${postStatus})`)
  }


//  Should we really be doing this?
//  Regardless of the postStatus?

  if (deletePost) {
    draft.TA_metaDelete()
    draft.removeTag('amoxtentli')
  } else {
    draft.addTag('amoxtentli')
    draft.meta = settings
    draft.TA_metaWrite()
  }
  draft.update()
}
