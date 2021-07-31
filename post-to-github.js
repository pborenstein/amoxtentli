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

const doc = `doc`


const options = {
    url: `https://api.github.com/repos/${githubUser}/${repo}/contents/${path}/${fname}`,
    method: 'GET',
    headers: {
        'Authorization': `token ${githubKey}`,
        'Accept': 'application/vnd.github.v3+json'
    }
}

function getSHA(path) {
  const request = {
    url: path,
    method: 'GET',
    headers: {
      'Authorization': `token ${githubKey}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  }

  let http = HTTP.create()
  let response = http.request(request)

  /**/draft.append(`response.statusCode: ${response.statusCode}`)

  if (response.statusCode == 404)
    return "false"  // doesn't exist

  if (response.statusCode == 200) {
    let parsedResponseText = JSON.parse(response.responseText)

    return parsedResponseText.sha
  }

}

// let url = `https://api.github.com/repos/${githubUser}/${repo}/contents/${path}/${fname}`
let url = `https://api.github.com/repos/${githubUser}/${repo}/contents/${path}/foo.md`
let sha = getSHA(url)

draft.append(`url: ${url}`)
draft.append(`sha: ${sha}`)

