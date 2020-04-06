---
title: "Scope, Export and Scoping"
metaTitle: "Scope and Linking"
metaDescription: "Implementing custom scoping"
---

## Scoping and Linking Summary
Here is a short excerpt from the book "Implementing Domain Specific Languages" about the mechanics
of cross referencing.

> The overall process of cross-reference resolution, that is, the interaction between the linker and the scope provider, can be simplified as follows:

> 1. The linker must resolve a cross-reference with text n in the program context cfor the feature f of type t.
> 2. The linker queries the scope provider: "give me the scope for the elements assignable to f in the program context c".
> 3. The scope searches for an element whose key matches with n.
> 4. If it finds it, it locates and loads the EObject pointed to by the IEObjectDescription and resolves the cross-reference.
> 5. Otherwise, it issues an error of the shape "Couldn't resolve reference to...".

## Differences in Scoping and Linking 
While in Xtext, custom scoping would just be a matter of editing the 
Xtend stub class SmallJavaScopeProvider, scoping and linking are done 
differently in DDK. The index built for lookups is done by 'hand' using
DDK. Export handles the resources which are 'exported' while scope handles
which resources are 'imported'. This will be explained by contrasting
how custom scoping in blocks would be done using both Xtext and DDK. Thus when implementing custom scoping, the Scope and Export files work hand-in-hand to both make resources visible in the index as well as finding the particular resources by the (qualified) names in the index. 

## Scope and Export Setup
We have already made a generic Export file earlier in the tutorial. Now we can add in a basic scope file by creating a new file called `SmallJava.scope` in the same directory as the Export file.

### Basic Scope File
```javascript
scoping org.example.smalljava.SmallJava

import "http://www.example.org/smalljava/SmallJava" as smalljava
```

Notice that you will import the Ecore model from the same directory.

### Scope Structure
There are 3 main parts to a Scope file.

#### Header
This is where the Xtext grammar a Scope file is written against should be put, in this case it is `scoping org.example.smalljava.SmallJava`. We also place the generated meta model from our grammar here. It is possible to reference other meta models and any models referred in the Scope file must be imported. In our import we have also defined an alias `as smalljava` for easier referencing. 
A Scope file can also include definitions contained by other scope files. One could reuse the scoping defined for a base grammar in a derived grammar. This is done using the keyword `with` similarly to Xtext and must be visible in the classpath. The DSL also supports Xtend expressions using the keyword `extension` and normal Xtend syntax. These extensions need to be visible in the classpath as well.

##### (Optional) Default naming
This can be used for defining:
- The default case sensitivity for scopes (Case sensitive being default)
- Default naming definitions that apply to all scope rules. These are only used if no other, more specific naming rules are defined by the scope rules. 

For example:
```javascript
case sensitive naming {
  smalljava::SJSymbol = this.name;
}
```
##### (Optional) Scope Definitions
States which elements are part of a scope in a given context. This can be considered similar to the method `getScope` in the Xtext file.


### Export Structure
The name of the export file must correspond to the name of the Xtext grammar, which is why we called the file `SmallJava.export` earlier.
There are 3 main sections to a `.export` file. 

##### Header
At the top of the file, we will usually import the meta model from the grammar of the DSL. Here, it is `import "http://www.example.org/smalljava/SmallJava"` using the namespace URI and we can add the optional alias `as smalljava` for easier referencing. For example, we can refer to the types from this model  (like SJClass) as `smalljava::SJClass`.
Xtend extensions can be imported using the expression:
`extension org::example::smalljava::SmallJavaModelUtil`.
Please note that there is a limitation in the Xtend to Java expression compiler, so only static JAVA extensions defined in the imported Xtend files can be used. 

##### Interface 
This defines exactly what pieces of information are semantically relevant to clients referencing a particular object. This essentially covers what objects need to be re-evaluated should a particular resource change. In our basic example, we have our EClass - SJClass and only the name is exported.

##### Export
This section specifies which objects should be exported and what details to attach to them. In the basic file, we export any `SJClass` as `name`. DDK does not use the same index mechanism as Xtext, instead storing all exported objects (interface items) as a hash and this is referred to as the _fingerprint_. It is stored as a [user data field in the index for the exported objects it pertains to](https://ddk.tools.avaloq.com/export.html). Thus, the keyword `object-fingerprint` is used to export the interface item SJClass.

## Scope for Blocks
Under the default scope provider, all variable declarations are visible in all contexts of the 
method body. We will be implementing custom scoping for symbol references to remedy this. Our objective is that variables in a block should not be referenced outside the block, and forward references should not be visible in scope.
In Xtext, this is done by overriding the `getSope` method in the automatically generated `SmallJavaScopeProvider.xtend` class:

```javascript
class SmallJavaScopeProvider extends AbstractSmallJavaScopeProvider {
	@Inject extension SmallJavaModelUtil
	@Inject extension SmallJavaTypeComputer
	
	val epackage = SmallJavaPackage.eINSTANCE

	override getScope(EObject context, EReference reference) {
		if (reference == epackage.SJSymbolRef_Symbol) {
			return scopeForSymbolRef(context)
		}
		return super.getScope(context, reference)
	}
		def protected IScope scopeForSymbolRef(EObject context) {
			val container = context.eContainer
			return switch (container) {
				SJMethod: Scopes.scopeFor(container.params)
				SJBlock:
					Scopes.scopeFor(
						container.statements.takeWhile[it != context].
							filter(SJVariableDeclaration),
						scopeForSymbolRef(container) // outer scope
				)
			default: scopeForSymbolRef(container)
		}
	}
```

Meanwhile in DDK:

1. We will first edit the export file to make sure the resources we need
are available in the index. 
2. Some utility files (`SmallJavaScoping.ext` and `SmallJavaScoping.xtend`) will be made to circumvent the limitation in the scope compiler because it cannot use Java functions.
3. Then, we will edit the scope file and find all the resources that should 
be found when in a nested block or accessing the valid variables.


### Export
The Xtext scoping file should give a pretty good idea of what resources need to be exported for this use case. We are going to need SJClass, SJMethod, SJBlock as well as any classes which cross reference these types. These include:
- SJParameter which can be of type SJClass
- SJVariableDeclaration which can also be of type SJClass

As such, we will edit our Scope file to look like:

```javascript
import "http://www.example.org/smalljava/SmallJava" as smalljava

interface {
  smalljava::SJClass = name;
  smalljava::SJMethod = name;
  smalljava::SJParameter = name;
  smalljava::SJBlock = @statements;
  smalljava::SJVariableDeclaration = name;
}

export lookup SJVariableDeclaration as name {
  object-fingerprint;
}


export lookup SJMethod as name {
  object-fingerprint;
}

export lookup SJClass as name {
  object-fingerprint;
}
```

Let's go through this section-by-section again:

##### Interface
Here we've added the other resources to be exported into the index. As before, we exported the names of most of them, called a **Value Expression**. In the case of SJBlock, we have exported the **Reference Expression** using the `@`. This includes all interfae items of the referenced object. There is another interface keyword called `eval` for **Generic Expression** which is not used.

##### Export
We are exporting all of these resources mainly for data exports and won't need to be looked up in the index for index queries. By default, the name of every exported object is qualified and so we can just export these resources as `name`.

### Utility Functions

Now we will add the utility files to do with scoping. Create 2 new files called `SmallJavaScoping.ext` and `SmallJavaScoping.xtend` in the same directory as the Scope and Export files. Then, add the following into the respective files:
 
SmallJavaScoping.ext:

```javascript
import ecore;
import smallJava;

List[smallJava::SJVariableDeclaration] getPreviousDeclarationsInBlock(smallJava::SJStatement this) :
  JAVA org.example.smalljava.SmallJavaScoping.getPreviousDeclarationsInBlock(org.example.smalljava.smallJava.SJStatement)
;

smallJava::SJStatement getParentStatement(ecore::EObject this) :
  JAVA org.example.smalljava.SmallJavaScoping.getParentStatement(org.eclipse.emf.ecore.EObject)
;
```

SmallJavaScoping.xtend:

```javascript
package org.example.smalljava

import java.util.List
import org.example.smalljava.smallJava.SJBlock
import org.example.smalljava.smallJava.SJStatement
import org.example.smalljava.smallJava.SJVariableDeclaration

class SmallJavaScoping {

  def static List<SJVariableDeclaration> getPreviousDeclarationsInBlock(SJStatement statement) {
    (statement.eContainer as SJBlock).statements.takeWhile[it != statement].filter(SJVariableDeclaration).toList
  }

}
```

What these files do is essentially the role of the function `scopeForSymbolRef` in the Xtext `getScope` class. This is a workaround required due to the fact that Scope has no Java compiler. We will proceed to implement our custom Scope.

### Scope
Let's handle the implementation like in Export, section-by-section

##### Header
To add the functionality of `scopeForSymbolRef`,  we will add our Xtend file `SmallJavaScoping` as an extension to the Scope and also utility methods from Ecore. This can be done with the following:

```javascript
import "http://www.eclipse.org/emf/2002/Ecore" as ecore

extension org::example::smalljava::SmallJavaScoping
...
```
##### Naming
Next, we will provide a naming scheme for SJSymbol using its `name` attribute.

```javascript
case sensitive naming {
  smalljava::SJSymbol = this.name;
}
```
##### Scope Definitions
Now we can define our Scope method as well as the general Scope rule. First, we define a Scope rule which returns the SJSymbol, the "end product" or innermost container which we are after in the index. 

```javascript
scope SJSymbol {
  context SJSymbolRef = scopeof(this, symbolDeclarations);
}
```

What this means is when we are in the `context` of a SJSymbolRef, give us the `scopeof` this under the method `symbolDeclarations` which we will write as follows:

```javascript
scope (symbolDeclarations) SJSymbol {
  context SJMethod = this.params
  >> scopeof(this.eContainer, symbolDeclarations);
  context SJBlock[SJMethod.isInstance(this.eContainer)] = scopeof(this.eContainer, symbolDeclarations);

  context SJStatement[SJBlock.isInstance(this.eContainer)] =
    this.getPreviousDeclarationsInBlock()
    >> scopeof(this.eContainer, symbolDeclarations);

   // fall back on parent if we don't have a block or method as immediate parent
  context SJBlock = scopeof(this.eContainer, symbolDeclarations);
  context SJStatement = scopeof(this.eContainer, symbolDeclarations);
}
```

### Full Scope for Blocks
Here is how the Scope file will look in full:

```javascript
scoping org.example.smalljava.SmallJava

import "http://www.example.org/smalljava/SmallJava" as smalljava
import "http://www.eclipse.org/emf/2002/Ecore" as ecore

extension org::example::smalljava::SmallJavaScoping

case sensitive naming {
  smalljava::SJSymbol = this.name;
}

scope SJClass {
  context * =
    find(SJClass) as export;
}

scope SJSymbol {
  context SJSymbolRef = scopeof(this, symbolDeclarations);
}

scope (symbolDeclarations) SJSymbol {
  context SJMethod = this.params
  >> scopeof(this.eContainer, symbolDeclarations);
  context SJBlock[SJMethod.isInstance(this.eContainer)] = scopeof(this.eContainer, symbolDeclarations);

  context SJStatement[SJBlock.isInstance(this.eContainer)] =
    this.getPreviousDeclarationsInBlock()
    >> scopeof(this.eContainer, symbolDeclarations);

   // fall back on parent if we don't have a block or method as immediate parent
  context SJBlock = scopeof(this.eContainer, symbolDeclarations);
  context SJStatement = scopeof(this.eContainer, symbolDeclarations);
}
```

Now we have implemented our own custom scope in DDK! 