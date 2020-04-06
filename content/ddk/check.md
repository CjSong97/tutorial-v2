---
title: "Check and Validation"
metaTitle: "Check and Validation"
metaDescription: "Implementing SmallJava with Check"
---
## Implementing Additional Features
If you were reading through the SmallJava grammar, you would have noticed that some features of Java were left ambiguous, such as:
- Cyclic classes being allowed
- Return statements not terminating a block
- Inheritance
- Access level modifiers

We will now begin implementing some of these missing features using the various tools from DDK as well as looking at a similar approach using Xtext.

## SmallJavaModelUtil
We will be using the helper methods from this class to aid in fully implementing
SmallJava. These methods will mainly be concerned with the Check file. Create a new Xtend class in the `src/org.example.smalljava` package and name it `SmallJavaModelUtil`. Then, add in the code below:


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

For now, you can think of these utility methods as simple getters for the fields we'll need to implement for checking properties later.

## Basic Check File Structure
The simplest way to create a check file is to make a file with a .check extension in your Eclipse project. We'll start with a basic check file that also injects the 
utility methods from `SmallJavaModelUtil`. Start by going to the directory `org.example.smalljava` -> `src` -> `org.example.smalljava.validation`. In this directory, we will create a general file called `SmallJava.check`.
Follow the recommendations from the Eclipse proposals and create a catalog for the check file. 

### Catalog
Every check file contains exactly one **catalog** which should have the same name as the check file (excluding the extension). These work together with **categories** to group checks together for reuse.

Now this check will be for the SmallJava grammar which we defined earlier. Add the following lines to the file, where the `@Inject` line is used to inject the utility functions we made earlier to use in conjunction with the checks:

```javascript
package org.example.smalljava.validation

import com.google.inject.Inject
import org.example.smalljava.SmallJavaModelUtil

/**
 * Check catalog for org.example.smalljava.SmallJava
 */
catalog SmallJava

for grammar org.example.smalljava.SmallJava {
    @Inject SmallJavaModelUtil modelutil;
}
```

Within the for loop is where we will add our Check **context** and **contraints**. I'll demonstrate how the context and contraints are structured by implementing a check for cyclic classes.

## Checking Cycles in Class Hierarchies
By default, cyclic class such as:
```java
class A extends C {}
class C extends B {} 
class B extends A{}
```
would be accepted in the SJ parser. Add the code below within the `for grammar org.example.smalljava.SmallJava` block.

```javascript
...
/**
   * @todo document check
   */
  live error CyclicClassCheck "Class Check"
  message "Cannot have cyclic class hierarchies" {
  	for SJClass c{
  		if (modelutil.classHierarchy(c).contains(c)){
  			issue on c
  		}
  	}
  }

```
Let's go through this check:
### Check Structure
##### Meta-data (Context)
- `live` : describes the execution time of the check. This will be executed at run time. Other keywords are `onSave` and `onDemand`
- `error` `YourConstraintName` : keyword `error` followed by your desired name for this constraint
- `"Class Check"` : The category under which the error will be put when sorting the errors by category in the Error log
- `message` : Keyword `message` followed by the error message 

##### Constraint
- `for SJClass c` : checks are usually iteratively written for the desired EClass
- `if...`: using the utility function classHierarchy, if there is a cyclic class do the following
- `issue on c` : Keyword `issue` creates the issue marker in the user interface. This terminates the control flow for this check.

You can also use `Ctrl+Space` when within the `for` block and select `check` to create a new generic check.
Compare this check code with an equal implementation using Xtext's validation:

```javascript
@Check def checkClassHierarchy (SJClass c) {
		if (c.classHierarchy.contains(c)) {
			error("cycle in hierarchy of class '" + c.name + "'",
				SmallJavaXPackage.eINSTANCE.SJClass_Superclass,
				HIERARCHY_CYCLE, c.superclass.name
			)
			
		}
	}

```

## Checking Member Selections
Continuing with checking member selections, we will now check whether a member
selection actually refers to a field, or a method invocation actually refers to
a method. 

### DDK
```javascript
live error MemberSelectionCheck "Member Selection Check"
message "Member selection error" {
	for SJMemberSelections sel {
		val member = sel.member
		if (member instanceof SJField && sel.methodinvocation){
			issue on member
		}

		else if (member instanceof SJMethod && !sel.methodinvocation){
			issue on member
		}
	}
}
```

We can access fields of Eclasses just as we could in Xtext as seen in `sel.member`. 

### Xtext
```javascript
public static val FIELD_SELECTION_ON_METHOD =
 ISSUE_CODE_PREFIX + "FieldSelectionOnMethod"
public static val METHOD_INVOCATION_ON_FIELD =
 ISSUE_CODE_PREFIX + "MethodInvocationOnField"

@Check def void checkMemberSelection(SJMemberSelection sel) {
	val member = sel.member

	if (member instanceof SJField && sel.methodinvocation)
		error(
			'''Method invocation on a field''',
			SmallJavaPackage.eINSTANCE.
				SJMemberSelection_MethodInvocation,
			METHOD_INVOCATION_ON_FIELD
		)
	else if (member instanceof SJMethod && !sel.methodinvocation)
		error(
			'''Field selection on a method''',
			SmallJavaPackage.eINSTANCE.
				SJMemberSelection_Member,
			FIELD_SELECTION_ON_METHOD
		)

}
```

## Checking Return Statements
Now we will put in the appropriate error statement for unreachable code from
code written after the return statement in a block. 

### DDK
```javascript
live error ReturnStatementCheck "Return Check"
message "Unreachable Code" {
	for SJBlock block{
		val statements = block.statements
		for(var i=0; i<statements.length-1; i++) {
			if (statements.get(i) instanceof SJReturn){
				//put error on the statement after return
				issue on statements.get(i+1)
			}
		}
	}
}
```

### Xtext
Contrast this with using Xtext:
```javascript
public static val UNREACHABLE_CODE = ISSUE_CODE_PREFIX +
"UnreachableCode"

@Check def void checkUnreachableCode (SJBlock block) {
	val statements = block.statements
	for (var i=0; i < statements.length-1; i++){
		if (statements.get(i) instanceof SJReturn){
				//put error on the statement after return
				error("Unreachable code",
					statements.get(i+1),
					null,
					UNREACHABLE_CODE)
				return
			}
	}
}
```

Notice that we don't need to add return at the end of the issue due to the way DDK terminates control flow once we hit the issue keyword.

## Visibility and Accessibility
We will now implement access level modifiers to SmallJava. This is not something we necessarily want scoping to handle as protected or private elements should still be visible to the index, just not accessible. Add the following to the SJField and SJMethod types in the grammar (SmallJava.xtext) file:

```javascript
SJField:
 	access=SJAccessLevel? SJTypedDeclaration ';';
SJMethod:
		access=SJAccessLevel? SJTypedDeclaration
		'(' (params+=SJParameter (',' params+=SJParameter)*)? ')'
		body=SJBlock ;
	enum SJAccessLevel:
 		PRIVATE='private' | PROTECTED='protected' | PUBLIC='public';
```

We will also be writing an additional class in the package `org.example.smalljava.validation` called `SmallJavaAccessibility`:
```javascript
import static extension org.eclipse.xtext.EcoreUtil2.*
class SmallJavaAccessibility {
	@Inject extension SmallJavaTypeConformance

	def isAccessibleFrom(SJMember member, EObject context) {
	val contextClass = context.getContainerOfType(SJClass)
	val memberClass = member.getContainerOfType(SJClass)
	switch (contextClass) {
	case contextClass === memberClass : true
	case contextClass.isSubclassOf(memberClass) :
	member.access != SJAccessLevel.PRIVATE
	default:
	member.access == SJAccessLevel.PUBLIC
		}
	}
}
```
What this class does is enforce that when the classes are the same, the members can always be accessed, while in a subclass you would onle be able to access members of the superclass that are not private. In all other cases, only public member can be accessed. Now we will write a check that checks the accessibility of a referred member. By writing a check instead of a scoping rule for it, we can also provide better error messages instead of the default "couldn't resolve reference to.." message that is usually given by something out of scope.

### DDK
```javascript
...
live error CheckMemberAccess "Accessbility Check"
message "The Member can't be accessed here" {
	for SJMemberSelection sel{
		val member = sel.member
		if(member.name != null && !member.isAccessibleFrom(sel)) {
			issue on sel
		}
	}
}
```


### Xtext
Here is how the check would look like as a validation rule:
```javascript
class SmallJavaValidator extends AbstractSmallJavaValidator {
...
	@Inject extension SmallJavaAccessibility
	public static val MEMBER_NOT_ACCESSIBLE =
	ISSUE_CODE_PREFIX + "MemberNotAccessible"
...
	@Check
	def void checkAccessibility(SJMemberSelection sel) {
		val member = sel.member
		if (member.name != null && !member.isAccessibleFrom(sel))
			error(
			'''The «member.access» member «member.name» is not accessible
			here''',
			SmallJavaPackage.eINSTANCE.SJMemberSelection_Member,
			MEMBER_NOT_ACCESSIBLE
			)
	}...

```