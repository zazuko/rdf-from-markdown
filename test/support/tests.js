const tests = [
  {
    title: 'produces quads using embedded tag',
    markdown: './test/support/roles.md',
    shacl: './test/support/roles.shacl',
  }, {
    title: 'produces quads using lists',
    markdown: './test/support/people.md',
    shacl: './test/support/people.shacl',
  }, {
    title: 'can use a taxonomy (recursive patterns)',
    markdown: './test/support/taxonomy.md',
    shacl: './test/support/taxonomy.shacl',
  }]

export { tests }
