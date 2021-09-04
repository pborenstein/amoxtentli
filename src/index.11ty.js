module.exports = class Home {

  data() {
    return {
      layout: "base.njk",
      home: true
    }
  }


//  if the summary is empty use stars
//  if the summary is '::' use the first img we find
//  otherise treat it as markdown

  getSummary(post) {
    const stars = "✼ ✼ ✼"
    let retval = 'oops'
    let summary = post.data.summary

    let re = /<img\s+class="amoxtentli"\s+src="([^"]+)"/
    let m = post.templateContent.match(re)

    if (! summary ) {
      retval = stars
    } else if (m && summary == '::') {
      retval = `<img src="${m[1]}">`
    } else {
      retval = this.markdown(summary)
    }

    return retval
  }


  render(data) {
    let head = `<h1 class="logo">${ data.config.siteName }</h1>`
        //  array.reverse() is destructive
        //  array.slice() is a javascript idiom
        //                     to copy an array
    let posts = data.collections.amoxtentli.slice()

    let body = `
<ul class="amoxtentli">
  ${posts.reverse().map(post =>
`     <li>
        <article>
          <header><a href="${post.url}">${post.data.title}</a></header>
          <section>
            ${this.getSummary(post)}
          </section>
      </article>
      <footer><a href="${post.data.draft}"># ${post.date.toDateString()}</a></footer>
     </li>`)
        .join("\n")}
</ul>`

    return head + body
  }
}

