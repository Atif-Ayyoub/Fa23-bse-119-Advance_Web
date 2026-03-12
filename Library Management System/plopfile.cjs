module.exports = (plop) => {
  plop.setGenerator('crud-page', {
    description: 'Generate CRUD page skeletons for a resource',
    prompts: [
      {
        type: 'input',
        name: 'resource',
        message: 'Resource name (e.g., books, members):',
      },
      {
        type: 'input',
        name: 'resourceTitle',
        message: 'Resource title (e.g., Book, Member):',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/generated/{{resource}}',
        base: 'tools/plop-templates',
        templateFiles: 'tools/plop-templates/*.hbs',
      },
    ],
  });
};
