module.exports = class Home {

  data() {
    return {
      layout: "base.njk",
      home: true
    }
  }

  getSummary(post) {
    const stars = "✼ ✼ ✼"
    let retval = 'oops'
    let summary = post.data.summary

    let re = /<img\s+class="amoxtentli"\s+src="([^"]+)"/
    let m = post.templateContent.match(re)

      //  if the summary is empty use stars
      //  if the summary is '::' use the first img we find
      //  otherise treat it as markdown

    if (! summary ) {
      retval = stars
    } else if (m && summary.startsWith('::')) {
      summary = this.markdown2(summary.slice(2))
      retval = `<img src="${m[1]}">${summary}`
    } else {
      retval = this.markdown(summary)
    }

    return retval
  }


  render(data) {
        //  array.reverse() is destructive
        //  array.slice() is a javascript idiom
        //                     to copy an array
    let posts = data.collections.amoxtentli.slice()

    let head = `<h1 class="logo">${ data.config.siteName }</h1>`
    let body = `
<ul class="amoxtentli">
  ${posts.reverse().map(post =>
`     <li>
        <article>
          <header><a href="${post.url}">${post.data.title}</a></header>
          <section>${this.getSummary(post)}</section>
          <footer><a href="${post.data.draft}"># ${post.date.toDateString()}</a></footer>
      </article>
     </li>`).join("\n")}
</ul>`

    return head + body
  }
}

