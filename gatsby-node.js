const path = require("path")
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
  const pageTemplate = path.resolve(`src/templates/page.js`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
              template
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    if (node.frontmatter.template === "blogpost") {
    createPage({
      path: node.frontmatter.path,
      component: blogPostTemplate,
      context: {
        slug: node.frontmatter.path,
      },
    })}
    if (node.frontmatter.template === "page") {
    createPage({
      path: node.frontmatter.path,
      component: pageTemplate,
      context: {
        slug: node.frontmatter.path,
      },
    })}
  })
}