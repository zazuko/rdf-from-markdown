export default {
  title: 'produces quads using embedded tag',
  markdown: `---
description: Embedded roles
---

# Roles

The roles are the following: 

## Pancake maker #role

Some text for the Pancake maker

### Who

- Bob (action::prepare)
- Alice (action::cook)

### Purpose

To make the best Pancakes in the world

### Song

Pancakes, Pancakes !

#### Embedded

### Tasks

- Mix ingredients
- Heat the pan
- Prepare the Pancakes

And a paragraph, explaining even more things

## Pancake seller #role

### Who

- Charlie

### Purpose

Sell the Pancakes to the customers

### Tasks

- Coordination of Pancake economic activities
- Advertise the Pancakes

# Some other topic

With a description
`,
  shacl: `@prefix code: <https://code.described.at/>.
@prefix dash: <http://datashapes.org/dash#>.
@prefix hydra: <http://www.w3.org/ns/hydra/core#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix schema: <http://schema.org/>.
@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix ex: <http://example.org/>.
@prefix mark: <http://markdown.org/>.

ex:roleShape a sh:NodeShape;
      mark:matchHashTag "#role";
      sh:class ex:Role;
      sh:name "Role";
      sh:property [ a sh:PropertyShape;
                    sh:name "Assignment";
                    sh:path ex:assignment;
                    mark:attachToHeader "Who";
                    mark:include mark:item;
                    mark:include mark:listItem;
                    sh:nodeKind sh:IRI
                  ],
                  [ a sh:PropertyShape;
                    sh:name "Purpose";
                    sh:path ex:purpose;
                    mark:attachToHeader "Purpose";
                    mark:include mark:item;
                    mark:include mark:listItem;
                    sh:nodeKind sh:Literal
                  ],
                  [ a sh:PropertyShape;
                    sh:name "Task";
                    mark:attachToHeader "Tasks";
                    mark:include mark:item;
                    mark:include mark:listItem;
                    sh:path ex:tasks;
                    sh:nodeKind sh:Literal
                  ].

ex:actionProp a mark:InlineMatcher;
               mark:matchInlineProperty "action";
               sh:path ex:action;
               sh:nodeKind sh:Literal.
`
}
