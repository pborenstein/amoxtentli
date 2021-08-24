
module.exports = function (eleventyConfig) {

  //  turns out YRGNI

  eleventyConfig.addPassthroughCopy("src/assets")

  eleventyConfig.addFilter("pdump", require("./js/pdump.js"))

  // The ever-popular markdown filter.
  eleventyConfig.addFilter("markdown", (content) => md.renderInline(content))

  eleventyConfig.addFilter("debugger", (...args) => {
    console.log('****')
    console.log(...args)
    console.log('----')

    debugger;
  })

  eleventyConfig.addCollection("byDraftDate", collectionAPI => {
    let list = collectionAPI.getFilteredByTag('amoxtentli')
                            .sort((a, b) => a.data.draftDate - b.data.draftDate)
    return list
  })

  //  Everyone wants to hook into the
  //  markdown processor

  const md =  require("markdown-it")({
                      html: true,
                      breaks: false,
                      linkify: true,
                      typographer: true
              })

  eleventyConfig.setLibrary("md", md)

  return {
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: [
      "md",
      "njk",
      "html"
    ],

    passthroughFileCopy: true,

    dir: {
      output:   "dist",
      input:    "src",
      includes: "includes", //  These are inside the `input` directory
      data:     "data"
    }
  }
}
