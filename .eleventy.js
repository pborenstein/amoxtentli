
module.exports = function (eleventyConfig) {

  //  turns out YRGNI

  eleventyConfig.addPassthroughCopy("src/assets")

  eleventyConfig.addFilter("pdump", require("./js/pdump.js"))


  //  Everyone wants to hook into the
  //  markdown processor

  const md =  require("markdown-it")({
                      html: true,
                      breaks: false,
                      linkify: false,
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
