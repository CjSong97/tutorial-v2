---
title: "Testing SmallJava"
metaTitle: "Testing SmallJava"
metaDescription: "Testing SmallJava"
---

As with any programming exercise, testing is crucial to development. The recommended way for testing your DSL with both Xtext and DDK is using Xtend. While testing of the parser is not done explicitly in this tutorial, the user is encouraged to write their own tests for SmallJava and can refer to the book Implementing Domain-Specific Languages with Xtext and Xtend for more testing examples. 

The basic flow of testing the implementation of SmallJava will be as follows:

1. Go to the directory `org.example.smalljava.tests` -> `src` -> `org.example.smalljava.tests` 
2. In the file `SmallJavaParsingTest.xtend` you will be able to write different unit tests for the implemented features of SmallJava. 

## Using SmallJava
To actually use SmallJava, which you can do now, proceed to `Run` -> `Run as` and select `Eclipse Application`. In this new Eclipse instance, you can create a project and within that project, create a new file with the extension `.smalljava`. Eclipse should prompt you to change the Project to an Xtext Project. Once agreed, you can now write a file in the DSL called SmallJava!