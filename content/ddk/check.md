---
title: "Check and Validation"
metaTitle: "Check and Validation"
metaDescription: "Implementing SmallJava with Check"
---
# Implementing Additional Features
If you were reading through the SmallJava grammar, you would have noticed that some features of Java were left ambiguous, such as:
- Cyclic classes being allowed
- Return statements not terminating a block
- 
# Basic Check File Structure
The simplest way to create a check file is to make a file with a .check extension in your Eclipse project. We'll start with a basic check file that also injects the 
utility methods from `SmallJavaModelUtil`. Start by going to the directory `org.example.smalljava` -> `src` and create a new folder called `org.example.smalljava.validation`. In this directory, we will create a file called `SmallJava.check`.
Follow the recommendations from the Eclipse proposals and create a catalog for the check file. 

### Catalog
Every check file contains exactly one catalog which should have the same name as the check file (excluding the extension). These work together with _categories_ to group checks together for reuse.

Now this check will be for the SmallJava grammar which we defined earlier. Add the following lines to the file, where the @Inject line is used to inject the utility functions we will use in conjunction with the checks:

```javascript
package org.example.smalljava.validation
/**
 * Check catalog for org.example.smalljava.SmallJava
 */
catalog CheckConventions

for grammar org.example.smalljava.SmallJava {
    @Inject SmallJavaModelUtil modelutil;
}
 
```

To introduce the validation rule structure as well as the constrains in a check file, we will implement a check for cyclic classes in SmallJava.

# Checking Cycles in Class Hierarchies
By default, cyclic class such as:
```java
class A extends C {}
class C extends B {} 
class B extends A{}
```
would be accepted in the SJ parser. Add the code below within the `for grammar org.example.smalljava.SmallJava` block.

```javascript
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
##### Meta-data
- `live` : describes the execution time of the check. This will be executed at run time. Other keywords are `onSave` and `onDemand`
- `error` `YourConstraintName` : keyword `error` followed by your desired name for this constraint
- "Class Check" : The category under which the error will be put when sorting the errors by category in the Error log
- `message` : Keyword `message` followed by the error message 

##### Constraint
- `for SJClass c` : checks usually iteratively written for the desired EClass
- `if...`: using the utility function classHierarchy, if there is a cyclic class
- `issue on c` : Keyword `issue` creates the issue marker in the user interface. This terminates the control flow for this check.

You can also use `Ctrl+Space` when within the `for` block and select check to create a new generic check.
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

# Checking Member Selections
Continuing with checking member selections, we will now check whether a member
selection actually refers to a field, or a method invocation actually refers to
a method. 

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

# Checking Return Statements
Now we will put in the appropriate error statement for unreachable code from
code written after the return statement in a block. 

### Xtext
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

### DDK
Contrast this with using Check:

```javascript
live error ReturnStatementCheck "Return Check"
message "Unreachable Code" {
	for SJBlock block{
		val statements = block.statements
		for(var i=0; i<statements.length-1; i++) {
			if (statements.get(i) instanceof SJReturn){
				//put error on the statement after return
				issue on statements.get(i+1)
				return
			}
		}
	}
}
```