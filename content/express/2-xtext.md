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

