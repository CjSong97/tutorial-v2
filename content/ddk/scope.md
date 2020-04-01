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
how custom scoping would be done using both Xtext and DDK. Thus when implementing
custom scoping, the Scope and Export files work hand-in-hand to both make
resources visible in the index as well as finding the particular resources by the (qualified) names in the index. 

## Scope and Export Setup
There is currently no way to automatically generate the stub files needed for Scope and Export. You should notice some errors  in `AbstractSmallJavaRuntime` from the lack of .export and .scope files when you've created your project and
after editing the MWE2 file. Under the 
directory `src` -> `org.example.smalljava` , create 2 new files called `SmallJava.scope` and `SmallJava.export`. 

### Basic Scope File
Here is an example of a basic Scope file which could fit into the placeholder scope file we made
to satisfy the MWE2 Error:

```javascript
scoping org.example.smalljava.SmallJava

import "http://ww.example.org/smalljava/SmallJava" as smalljava
```

Notice that you will import the Ecore model from the same directory.

### Basic Export File
The name of the export file must correspond to the name of the Xtext grammar.
Here is an example of a basic export file for the smalljava language:

```javascript
import "http://www.example.org/smalljava/SmallJava" as smalljava

interface {
    smalljava::SJClass = name;
}


export SJClass as name {
    object-fingerprint;
}
```

### Export Structure
There are 3 main sections to a `.export` file. 

#### Header
At the top of the file, we will usually import the meta model from the grammar of the DSL. Here it is `import "http://www.example.org/smalljava/SmallJava"` using the namespace URI and we can add the optional alias `as smalljava`. From here, we can refer to the types from this model  (like SJClass) as `smalljava::SJClass`.
Xtend extensions can be imported using the expression:
```extension org::example::smalljava::SmallJavaModelUtil```
where there is a limitation in the Xtend to Java expression compiler, so only static JAVA extensions defined in the imported Xtend files can be used. 

#### Interface 
This defines exactly what pieces of information are semantically relevant to clients referencing a particular object. This essentially covers what objects need to be re-evaluated should a particular resource change. In our basic example, we have our EClass - SJClass and only the name is exported.

#### Export
This section specifies which objects should be exported and what details to attach to them. In the basic file, we export any `SJClass` as `name`. DDK does not use the same index mechanism as Xtext, instead storing all exported objects (interface items) as a hash and this is referred to as the _fingerprint_. It is stored as a [user data field in the index for the exported objects it pertains to](https://ddk.tools.avaloq.com/export.html). Thus, the keyword `object-fingerprint` is used to export the interface item SJClass.

## Scope for Blocks
Under the default scope provider, all variable declarations are visible in all contexts of the 
method body. We will be implementing custom scoping for symbol references to remedy this. 
In Xtext, this is done by overriding the `getSope` method in the automatically generated
`SmallJavaScopeProvider.xtend` class:

```javascript
class SmallJavaXScopeProvider extends AbstractSmallJavaXScopeProvider {
	val epackage = SmallJavaXPackage.eINSTANCE
	@Inject extension SmallJavaModelUtil
	@Inject extension SmallJavaTypeComputer
	
	override getScope(EObject context, EReference reference){
		if (reference == epackage.SJSymbolRef_Symbol) {
			return scopeForSymbolRef(context)
		}
		else if (context instanceof SJMemberSelection) {
			return scopeForMemberSelection(context)
		}
		return super.getScope(context, reference)
	}
    ...

```

Meanwhile in DDK:
1. We will first edit the export file to make sure the resources we need
are available in the index. 
2. Then, we will edit the scope file and find all the resources that should 
be found when in a nested block or accessing the valid variables.
 

