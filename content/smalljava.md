---
title: "Semantic Model: SmallJava"
metaTitle: "Introducing SmallJava"
metaDescription: "This page will be used to guide the user through creating the domain model for SmallJava and the grammar in Xtext"
---

# SmallJava
As Fowler strongly suggests in his book on DSLs, it is always better to start developing DSLs with a semantic model or grammar in mind. 
We will be using a subsection of Java's capabilities and call this smaller language SmallJava to demonstrate both Xtext as well as the Avaloq DDK. 

This language will not be a complete language and is a simplified version of Java.

# The Full Grammar
``` javascript
grammar org.example.smalljava.SmallJava 
with org.eclipse.xtext.common.Terminals

generate smallJava "http://www.example.org/smalljava/SmallJava"

SJProgram:
 classes+=SJClass*;

SJClass: 'class' name=ID ('extends' superclass=[SJClass])? '{'
 members += SJMember*
 '}' ;

SJMember:
 SJField | SJMethod ;

SJField:
 SJTypedDeclaration ';' ;

SJMethod:
 SJTypedDeclaration
 '(' (params+=SJParameter (',' params+=SJParameter)*)? ')'
 body=SJBlock ;

SJParameter:
 SJTypedDeclaration ;

SJBlock:
 {SJBlock} '{' statements += SJStatement* '}' ;

SJStatement:
 SJVariableDeclaration |
 SJReturn |
 SJExpression ';' |
 SJIfStatement
;

SJVariableDeclaration:
 SJTypedDeclaration '=' expression=SJExpression ';'
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

fragment SJTypedDeclaration *:
 type=[SJClass] name=ID ;

SJNamedElement:
 SJClass | SJMember | SJSymbol ;

SJExpression: SJAssignment ;

SJAssignment returns SJExpression:
 SJSelectionExpression
 ({SJAssignment.left=current} '=' right=SJExpression)? // Right
associativity
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

# SmallJavaModelUtil
We will also be using the helper methods from this class to aid in fully implementing
SmallJava. These methods will mainly be concerned with the Check files. Create a new Xtend file in 
the `src/org.example.smalljava` package and name it `SmallJavaModelUtil`. Then, add in the code below:


```javascript
package org.example.smalljava

import org.example.smalljava.smallJava.SJReturn
import org.example.smalljava.smallJava.SJBlock
import org.example.smalljava.smallJava.SJMethod
import org.example.smalljava.smallJava.SJClass
import org.example.smalljava.smallJava.SJField

class SmallJavaModelUtil {
	def fields(SJClass c) {
		c.members.filter(SJField)
		}
	def methods(SJClass c) {
		c.members.filter(SJMethod)
		}
	def returnStatement(SJMethod m) {
		m.body.returnStatement
		}
	def returnStatement(SJBlock block) {
		block.statements.filter(SJReturn).head
		}
		
	//visit class hierarchy, inspect superclass and stop when superclass
	//is null or class already visited
	def classHierarchy(SJClass c){
		val visited = newLinkedHashSet()
		
		var current = c.superclass
		while(current!==null && !visited.contains(current)){
			visited.add(current)
			current = current.superclass
		}
		
		visited
	}
	
	
}
```