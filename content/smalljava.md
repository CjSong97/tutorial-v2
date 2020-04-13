---
title: "Semantic Model: SmallJava"
metaTitle: "Introducing SmallJava"
metaDescription: "This page will be used to guide the user through creating the domain model for SmallJava and the grammar in Xtext"
---

As Martin Fowler strongly suggests in his book on DSLs, it is always better to start developing DSLs with a semantic model or grammar in mind. 
We will be using a subsection of Java's capabilities and call this smaller language SmallJava to demonstrate both Xtext as well as the Avaloq DDK. 

This language will not be a complete language and is a simplified version of Java. Please see the Express Resources section for further information about what features will be omitted for the sake of simplicity. Please add the following code to the `SmallJava.xtext` file. 

## The Full Grammar
``` javascript
grammar org.example.smalljava.SmallJava with org.eclipse.xtext.common.Terminals
generate smallJava "http://www.example.org/smalljava/SmallJava"
SJProgram:
classes+=SJClass*;

SJClass: 'class' name=ID ('extends' superclass=[SJClass])? '{'
members += SJMember*
'}' ;

SJMember: SJField | SJMethod ;
SJField: type=[SJClass] name=ID ';' ;
 
SJMethod:
type=[SJClass] name=ID 
'(' (params+=SJParameter (',' params+=SJParameter)*)? ')'
body=SJBlock ;

SJParameter:
type=[SJClass] name=ID ;

SJBlock:
{SJBlock} '{' statements += SJStatement* '}' ;

SJStatement:
SJVariableDeclaration |
SJReturn |
SJExpression ';' |
SJIfStatement
;

SJVariableDeclaration:
type=[SJClass] name=ID '=' expression=SJExpression ';'
;

SJReturn:
'return' expression=SJExpression ';'
;

SJIfStatement:
'if' '(' expression=SJExpression ')' thenBlock=SJIfBlock
(=>'else' elseBlock=SJIfBlock)?
;

SJIfBlock returns SJBlock:
statements += SJStatement
| SJBlock ;

SJSymbol: SJVariableDeclaration | SJParameter ;

SJNamedElement:
SJClass | SJMember | SJSymbol ;
SJExpression: SJAssignment ;

SJAssignment returns SJExpression:
SJSelectionExpression
({SJAssignment.left=current} '=' right=SJExpression)? // Right associativity
;

SJSelectionExpression returns SJExpression:
SJTerminalExpression
(
{SJMemberSelection.receiver=current} '.'
member=[SJMember]
(methodinvocation?='('
(args+=SJExpression (',' args+=SJExpression)*)? ')'
)?
)* ;

SJTerminalExpression returns SJExpression:
{SJStringConstant} value=STRING |
{SJIntConstant} value=INT |
{SJBoolConstant} value = ('true' | 'false') |
{SJThis} 'this' |
{SJNull} 'null' |
{SJSymbolRef} symbol=[SJSymbol] |
{SJNew} 'new' type=[SJClass] '(' ')' |
'(' SJExpression ')'
;
```

