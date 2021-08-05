// post-to-github.js

// https://forums.getdrafts.com/t/script-step-post-to-github-without-working-copy/3594

function pad(n) {
    let str = String(n);
    while (str.length < 2) {
        str = `0${str}`;
    }
    return str;
}

const posttime = new Date()
const drafttime = draft.createdAt

const dateStr = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const timeStr = date => `${pad(date.getHours())}:${pad(date.getMinutes())}`

const postStamp  = `${dateStr(posttime)}T${timeStr(posttime)}`
const draftStamp = `${dateStr(drafttime)}T${timeStr(drafttime)}`

// const fname = `${dateStr(posttime)}-${timeStr(posttime)}.md`
const fname = `${draft.uuid.toLowerCase()}.md`
let url = `https://api.github.com/repos/${githubUser}/${opt_repo}/contents/${opt_path}/${fname}`
// let url = `https://api.github.com/repos/${githubUser}/${repo}/contents/${path}/foo.md`


// if (draft.lines.length == 1) {
//   title = null
//   summary = draft.content
//   content =
// }
//
//  herewith: the defaults

console.log(`opt_summary: ${opt_summary}`)

draft.content = draft.content.trim()

let fm_date       = posttime.toISOString()
let fm_draftDate  = drafttime.toISOString()
let fm_title      = draft.displayTitle
let fm_draft      = draft.permalink
let fm_summary    = opt_summary || draft.bodyPreview(240).replace(/"/g, '\\"')
let fm_content    = draft.lines.slice(1).join('\n')


// ---
// date: 2021-08-02T18:10:44.925Z
// draftDate: 2021-08-02T18:09:50.679Z
// title: ✼ ✼ ✼
// draft: drafts5://open?uuid=4967ED98-95A0-4EDB-A05C-8646CBBEFEA9
// summary: "one thing they don't tell you about aging is how hard it gets to clip your toenails"
// ---

if (draft.lines.length == 1) {
  fm_title = "✼ ✼ ✼"
  fm_summary = draft.content.replace(/"/g, '\\"')
  fm_content = fm_summary
}

const doc = `---
date: ${fm_date}
draftDate: ${fm_draftDate}
title: ${fm_title}
newlines: ${opt_newlines}
draft: ${fm_draft}
summary: "${fm_summary}"
---

${fm_content}
`


//  we're using a single request object
//  and filling in the changes

const gRequest = {
  url: opt_path,
  method: 'GET'
}


function getSHA(path) {
  // this is the global request object
  gRequest.url = path

  let response = http.request(gRequest)
  console.log(`getSHA: response.statusCode: ${response.statusCode}`)

  if (response.statusCode == 404)
    return false  // file doesn't exist

  if (response.statusCode == 200) {
      //  the file exists, so get its sha
    let parsedResponseText = JSON.parse(response.responseText)
    return parsedResponseText.sha
  }

  //  something strange happened :shrug:
  context.cancel()
  app.displayErrorMessage(`getSHA statusCode (${response.statusCode})`)
}

let http = HTTP.create()

//  playing loose with globals
//
let sha = getSHA(url)

console.log(`url: ${url}`)
console.log(`sha: ${sha}`)
console.log(`opt_deletePost: ${opt_deletePost}`)


// set up the request


if (opt_deletePost) {
  gRequest.method = 'DELETE'
  gRequest.data = {
    message: `note deleted at ${postStamp}`,
    sha: sha
  }
} else {
  gRequest.method =  'PUT';
  gRequest.data = {
        message: `note posted at ${postStamp}`,
        content: Base64.encode(doc),
        branch: 'main'
  }
}


gRequest.headers = {
    Authorization: `token ${githubKey}`,
    Accept: 'application/vnd.github.v3+json'
  }


if (opt_deletePost) {
  console.log(`will delete post`)
} else if (!sha) {
  console.log(`will post as new`)
} else {
  gRequest.data.sha = sha
  console.log(`overwrite existing`)
}

console.log(`gRequest: ${JSON.stringify(gRequest, null, 2)}`)

let response = http.request(gRequest)

console.log(`response.error: ${response.error}`)
console.log(`response.headers: ${response.headers}`)
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
