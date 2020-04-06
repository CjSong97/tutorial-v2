---
title: "Basic Xtext Concepts and SmallJava"
metaTitle: "Xtext Concepts"
metaDescription: "Xtext grammar language"
---

## Xtext Grammar Language

## SmallJava
In this section I will go through the SmallJava model part-by-part to help you get a grasp of the language. Here is a list of the simplifications made to Java to make SmallJava:

- Classes have no explicit constructors
- There is no cast expression
- Arithmetic and boolean expressions are not implemented
- Basic types (such as int, boolean, and so on) and void methods are not
considered (methods must always return something)
- There is no method overloading
- Member access must always be prefixed with the object, even if it is this
- Variable declarations must always be initialized
- super is not supported, but it will be implemented in the next chapter
- The new instance expression does not take arguments, since there are only
implicit default constructors
- Package and imports are not supported, but they will be implemented in the
next chapter

## Grammar Rules
#### Header
Every DSL built by Xtext starts with the header which contains the language declaration for the language being built. For smalljava, it was:
```javascript
grammar org.example.smalljava.SmallJava
    with org.eclipse.xtext.common.Terminals
generate smalljava "http://www.example.org/smalljava/SmallJava"
```



```javascript
SJProgram:
    classes += SJClass*;

SJClass: 'class' name=ID ('extends' superclass=[SJClass]) ? '{'
    members += SJMember*
    '}';

SJMember: SJField | SJMethod ;
```

The language begins simply enough.
- A SJProgram consists of zero or more SJClasses
- SJClasses must begin with the keyword `class` followed by a name. Optionally, these classes can have a superclass and must have the keyword `extends` if they are an inheriting class. SJClass can have zero or more SJMembers.
- SJMembers are either SJFields or SJMethods.



