export default {
  title:`can use a taxonomy (recursive patterns)`,
  markdown:`# Things

## Food

### Red

#### Tomato

A tomato most of the time is red in Europe

### Green

- Lettuce

## Tools

### Metal

* Screwdriver
* Hammer

### Wood

- 1
- 2
- 3
`,
  shacl:`@prefix code: <https://code.described.at/>.
@prefix dash: <http://datashapes.org/dash#>.
@prefix hydra: <http://www.w3.org/ns/hydra/core#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix schema: <http://schema.org/>.
@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix ex: <http://example.org/>.
@prefix mark: <http://markdown.org/>.

ex:categoryShape a sh:NodeShape;
  mark:matchType mark:Root;
  sh:class ex:Thing;
  sh:property [ a sh:PropertyShape;
    mark:attachToHeader mark:all;
    mark:include mark:header;
    mark:include mark:listItem;
    sh:path ex:hasChildren;
    sh:nodeKind sh:IRI;
    sh:node ex:categoryShape
  ].
`
}
