---
title: "Check and Validation"
metaTitle: "Check and Validation"
metaDescription: "Implementing SmallJava with Check"
---
# Basic Check File Structure
The simplest way to create a check file is to make a file with a .check extension in your Eclipse project. We'll start with a basic check file that also injects the 
utility methods from `SmallJavaModelUtil`.


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



# Checking Cycles in Class Hierarchies
We will write a check method to check for cyclic class hierarchies.
By default this is accepted in the SJ parser. Under the validation package
in org.example.smalljava.validation, create a file and name it `SmallJava.check`.

Add the code below within the `for grammar org.example.smalljava.SmallJava` block.

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

//(Mention the boolean method 'methodinvocation' which defaults to true)
//(Put in dissertation i learnt about comments??)

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