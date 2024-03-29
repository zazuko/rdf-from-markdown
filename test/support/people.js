export default {
  title: 'produces quads using lists',
  markdown: `# Alice

## Properties

age :: 22

# Bob (age :: 42)

## Interests

- Eating

# Charlie

## Description

Charlie is a good guy. (age :: 56)
  `, shacl: `
  @prefix code: <https://code.described.at/>.
@prefix dash: <http://datashapes.org/dash#>.
@prefix hydra: <http://www.w3.org/ns/hydra/core#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix schema: <http://schema.org/>.
@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix ex: <http://example.org/>.
@prefix mark: <http://markdown.org/>.

ex:peopleShape a sh:NodeShape;
  mark:matchType mark:Root;
  sh:class ex:People;
  sh:property [ a sh:PropertyShape;
    mark:attachToHeader mark:all;
    mark:include mark:header;
    sh:path schema:hasPart;
    sh:nodeKind sh:IRI;
    sh:node ex:personShape
  ].

ex:personShape a sh:NodeShape;

      sh:name "Person";
      sh:class ex:Person;
      sh:property [ a sh:PropertyShape;
                    mark:attachToHeader mark:all;
                    sh:path ex:content;
                    sh:name "name";
                    mark:include mark:listItem;
                    mark:include mark:item;
                    sh:nodeKind sh:IRI
      ].


ex:ageProp a mark:InlineMatcher;
       mark:matchInlineProperty "age";
       sh:path ex:hasAge;
       sh:nodeKind sh:Literal.

  `,
}
