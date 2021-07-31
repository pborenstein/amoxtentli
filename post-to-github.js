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
let url = `https://api.github.com/repos/${githubUser}/${repo}/contents/${path}/${fname}`
// let url = `https://api.github.com/repos/${githubUser}/${repo}/contents/${path}/foo.md`

const doc = `doc`

//  we're using a single request object
//  and filling in the changes

const gRequest = {
  url: path,
  method: 'GET',
  headers: {
    'Authorization': `token ${githubKey}`,
    'Accept': 'application/vnd.github.v3+json'
  }
}


function getSHA(path) {
  let http = HTTP.create()
      gRequest.url = path
  let response = http.request(gRequest)

  console.log(`response.statusCode: ${response.statusCode}`)

  if (response.statusCode == 404)
    return false  // doesn't exist

  if (response.statusCode == 200) {
    let parsedResponseText = JSON.parse(response.responseText)
    return parsedResponseText.sha
  }

  context.cancel()
  app.displayErrorMessage(`Something went wrong (${response.statusCode})`)

}

let sha = getSHA(url)

console.log(`url: ${url}`)
console.log(`sha: ${sha}`)



// set up the request

gRequest.method = 'PUT'
gRequest.data = {
      message: `note created at ${postStamp}`,
      content: Base64.encode(doc),
      branch: 'main'
}

//  add a sha if we need it
if (sha) {
  gRequest.sha = sha
}




if (!sha) {
  console.log(`will post as new`)
} else {
  console.log(`overwrite existing`)
}
console.log(`gRequest: ${JSON.stringify(gRequest, null, 2)}`)

let http = HTTP.create()
let response = http.request(gRequest)
if (response.statusCode <= 250) {
  app.displaySuccessMessage('Posted')
} else {
  app.displayErrorMessage(`Something went wrong (${response.statusCode})`)
}
