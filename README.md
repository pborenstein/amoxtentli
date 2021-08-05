# amoxtentli

[amoxtentli](https://nahuatl.uoregon.edu/content/amoxtentli)

marginalia

---

## Notes on playing with Drafts

The idea:


post from draft to a web page,
using Drafts actions & GitHub's
webhooks to kick off a build:

```text
+------+    +------+    +----------+
|Drafts|--->|GitHub|--->|Amoxtentli|
+------+    +------+    +----------+
```

originally we were using the date
to make a file name

- any time the action runs = new file
- publish a note many times
- use the same physical note for
  everything

ever draft has a uuid

we can use that for the file name in the repo

that means we can update posts


dates

originally I was using the draft date
as the date of the post

but if we use uuids
we should use the action date
as the post date to
bump things to the top

github implementation

creating a new file
is no problem
thats why my date-based filename
always worked

but if you try to replace an existing
file, you need the sha of the last time
you wrote it

- we can get the hash of the file if it exists
- or we can store the hash in the draft


## successful file creation

```
mm

-------
{
  "url": "https://api.github.com/repos/pborenstein/amoxtentli/contents/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md",
  "method": "PUT",
  "data": {
    "message": "note created at 2021-07-30T00:27",
    "content": "ZG9j",
    "branch": "main"
  },
  "headers": {
    "Authorization": "token not-a-real-token_wMQ1uLiDWn2gz627WRPTgBjht0OZ2G1Z3OUL"
  }
}
error:
headers: {
  "Content-Length": "2193",
  "x-ratelimit-remaining": "4999",
  "x-accepted-oauth-scopes": "",
  "content-security-policy": "default-src 'none'",
  "access-control-expose-headers": "ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, Deprecation, Sunset",
  "x-github-request-id": "D35E:0698:1C8F1D7:37BEB75:61037FC5",
  "Vary": "Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With",
  "Strict-Transport-Security": "max-age=31536000; includeSubdomains; preload",
  "Server": "GitHub.com",
  "x-ratelimit-resource": "core",
  "Date": "Fri, 30 Jul 2021 04:27:49 GMT",
  "x-ratelimit-used": "1",
  "x-github-media-type": "github.v3; format=json",
  "x-ratelimit-limit": "5000",
  "referrer-policy": "origin-when-cross-origin, strict-origin-when-cross-origin",
  "x-frame-options": "deny",
  "Access-Control-Allow-Origin": "*",
  "x-ratelimit-reset": "1627622869",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "private, max-age=60, s-maxage=60",
  "x-content-type-options": "nosniff",
  "x-xss-protection": "0",
  "Etag": "\"243111e729d5cf3c554f924ab31ee195833e11a11cf598e99c364108ac50e203\"",
  "x-oauth-scopes": "repo"
}
responseData: {}
responseText: {"content":{"name":"5d5a1ec3-8afd-4bab-b245-03af6014e54b.md","path":"src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md","sha":"325ab0db62d4686e5e633ebfbbfddaac883e9e96","size":3,"url":"https://api.github.com/repos/pborenstein/amoxtentli/contents/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md?ref=main","html_url":"https://github.com/pborenstein/amoxtentli/blob/main/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md","git_url":"https://api.github.com/repos/pborenstein/amoxtentli/git/blobs/325ab0db62d4686e5e633ebfbbfddaac883e9e96","download_url":"https://raw.githubusercontent.com/pborenstein/amoxtentli/main/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md","type":"file","_links":{"self":"https://api.github.com/repos/pborenstein/amoxtentli/contents/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md?ref=main","git":"https://api.github.com/repos/pborenstein/amoxtentli/git/blobs/325ab0db62d4686e5e633ebfbbfddaac883e9e96","html":"https://github.com/pborenstein/amoxtentli/blob/main/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md"}},"commit":{"sha":"556dd9ac6005e89769f06e0775f6f55cbdb145ec","node_id":"MDY6Q29tbWl0Mzg5NTEzNjYyOjU1NmRkOWFjNjAwNWU4OTc2OWYwNmUwNzc1ZjZmNTVjYmRiMTQ1ZWM=","url":"https://api.github.com/repos/pborenstein/amoxtentli/git/commits/556dd9ac6005e89769f06e0775f6f55cbdb145ec","html_url":"https://github.com/pborenstein/amoxtentli/commit/556dd9ac6005e89769f06e0775f6f55cbdb145ec","author":{"name":"Philip Borenstein","email":"pborenstein@gmail.com","date":"2021-07-30T04:27:49Z"},"committer":{"name":"Philip Borenstein","email":"pborenstein@gmail.com","date":"2021-07-30T04:27:49Z"},"tree":{"sha":"1ccc2099d1309856a8ee14cc7c105d5b1f9e8034","url":"https://api.github.com/repos/pborenstein/amoxtentli/git/trees/1ccc2099d1309856a8ee14cc7c105d5b1f9e8034"},"message":"note created at 2021-07-30T00:27","parents":[{"sha":"d7816aa965b6914eee9e340f644c956135f41d53","url":"https://api.github.com/repos/pborenstein/amoxtentli/git/commits/d7816aa965b6914eee9e340f644c956135f41d53","html_url":"https://github.com/pborenstein/amoxtentli/commit/d7816aa965b6914eee9e340f644c956135f41d53"}],"verification":{"verified":false,"reason":"unsigned","signature":null,"payload":null}}}
statusCode: 201
success: false
parsed responseText: {
  "content": {
    "name": "5d5a1ec3-8afd-4bab-b245-03af6014e54b.md",
    "path": "src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md",
    "sha": "325ab0db62d4686e5e633ebfbbfddaac883e9e96",
    "size": 3,
    "url": "https://api.github.com/repos/pborenstein/amoxtentli/contents/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md?ref=main",
    "html_url": "https://github.com/pborenstein/amoxtentli/blob/main/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md",
    "git_url": "https://api.github.com/repos/pborenstein/amoxtentli/git/blobs/325ab0db62d4686e5e633ebfbbfddaac883e9e96",
    "download_url": "https://raw.githubusercontent.com/pborenstein/amoxtentli/main/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/pborenstein/amoxtentli/contents/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md?ref=main",
      "git": "https://api.github.com/repos/pborenstein/amoxtentli/git/blobs/325ab0db62d4686e5e633ebfbbfddaac883e9e96",
      "html": "https://github.com/pborenstein/amoxtentli/blob/main/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md"
    }
  },
  "commit": {
    "sha": "556dd9ac6005e89769f06e0775f6f55cbdb145ec",
    "node_id": "MDY6Q29tbWl0Mzg5NTEzNjYyOjU1NmRkOWFjNjAwNWU4OTc2OWYwNmUwNzc1ZjZmNTVjYmRiMTQ1ZWM=",
    "url": "https://api.github.com/repos/pborenstein/amoxtentli/git/commits/556dd9ac6005e89769f06e0775f6f55cbdb145ec",
    "html_url": "https://github.com/pborenstein/amoxtentli/commit/556dd9ac6005e89769f06e0775f6f55cbdb145ec",
    "author": {
      "name": "Philip Borenstein",
      "email": "pborenstein@gmail.com",
      "date": "2021-07-30T04:27:49Z"
    },
    "committer": {
      "name": "Philip Borenstein",
      "email": "pborenstein@gmail.com",
      "date": "2021-07-30T04:27:49Z"
    },
    "tree": {
      "sha": "1ccc2099d1309856a8ee14cc7c105d5b1f9e8034",
      "url": "https://api.github.com/repos/pborenstein/amoxtentli/git/trees/1ccc2099d1309856a8ee14cc7c105d5b1f9e8034"
    },
    "message": "note created at 2021-07-30T00:27",
    "parents": [
      {
        "sha": "d7816aa965b6914eee9e340f644c956135f41d53",
        "url": "https://api.github.com/repos/pborenstein/amoxtentli/git/commits/d7816aa965b6914eee9e340f644c956135f41d53",
        "html_url": "https://github.com/pborenstein/amoxtentli/commit/d7816aa965b6914eee9e340f644c956135f41d53"
      }
    ],
    "verification": {
      "verified": false,
      "reason": "unsigned",
      "signature": null,
      "payload": null
    }
  }
}
-------
```


failure

```
aa
-------
{
  "url": "https://api.github.com/repos/pborenstein/amoxtentli/contents/src/posts/5d5a1ec3-8afd-4bab-b245-03af6014e54b.md",
  "method": "PUT",
  "data": {
    "message": "note created at 2021-07-30T02:29",
    "content": "ZG9j",
    "branch": "main"
  },
  "headers": {
    "Authorization": "token not-a-real-token_wMQ1uLiDWn2gz627WRPTgBjht0OZ2G1Z3OUL"
  }
}
error:
headers: {
  "x-frame-options": "deny",
  "Strict-Transport-Security": "max-age=31536000; includeSubdomains; preload",
  "Date": "Fri, 30 Jul 2021 06:29:06 GMT",
  "access-control-expose-headers": "ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, Deprecation, Sunset",
  "x-accepted-oauth-scopes": "",
  "Access-Control-Allow-Origin": "*",
  "x-github-media-type": "github.v3; format=json",
  "Content-Length": "156",
  "content-security-policy": "default-src 'none'",
  "x-github-request-id": "D698:40A0:1AB8000:3665F46:61039C32",
  "x-oauth-scopes": "repo",
  "x-ratelimit-limit": "5000",
  "x-ratelimit-resource": "core",
  "x-content-type-options": "nosniff",
  "x-ratelimit-reset": "1627630146",
  "x-ratelimit-used": "1",
  "x-ratelimit-remaining": "4999",
  "x-xss-protection": "0",
  "referrer-policy": "origin-when-cross-origin, strict-origin-when-cross-origin",
  "Content-Type": "application/json; charset=utf-8",
  "Server": "GitHub.com",
  "Vary": "Accept-Encoding, Accept, X-Requested-With"
}
responseData: {}
responseText: {"message":"Invalid request.\n\n\"sha\" wasn't supplied.","documentation_url":"https://docs.github.com/rest/reference/repos#create-or-update-file-contents"}
statusCode: 422
success: false
parsed responseText: {
  "message": "Invalid request.\n\n\"sha\" wasn't supplied.",
  "documentation_url": "https://docs.github.com/rest/reference/repos#create-or-update-file-contents"
}
-------
```

it's weird about
`responseData` is `{}`
and that I have to parse the
`responseText`

hey, wait a minute:

```
  -H "Accept: application/vnd.github.v3+json"
```

yeah, no, no, yeah, that did nothing

but after looking around I found this

https://forums.getdrafts.com/t/draft-to-readwise/9313/8?u=pborenstein

```
You will probably need to parse the JSON response yourself from the responseText. Try:


// parse response JSON to object
let responseData = JSON.parse(response.responseText);
```

that's just great

## so here's the flow

get the sha from the file

- if it exists, we'll get a sha

- if the doesn't we get a 404 and:

```
{
    "message": "Not Found",
    "documentation_url": "https://docs.github.com/rest/reference/repos#get-repository-content"
}
```


## This is interesting

```
{{post.data.collections.amoxtentli[1].template.frontMatter.content  }}
```
