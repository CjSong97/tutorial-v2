---
title: "Troubleshooting"
metaTitle: "Troubleshooting"
metadescription: "This page will be used to help the user with common problems"
---
# Issues
### Installation and Project Setup

#### I keep getting errors in the generated packages for Xtend files that 'Superclass must be a class'

Usually, these are the stub Xtend classes generated for Xtext. It should be safe to delete these files to remove the error.


### Format
#### There is an error in the auto-generated Format stub
Usually, that error can be solved by left-clicking where the line of the error is and following the proposal from Eclipse to implement unimplemented methods.

### Scope
#### AbstractSmallJavaRuntime has missing classes for SmallJavaFingerprintComputer...
This can be solved by adding a .scope file under the grammar name and in the same directory as the `.xtext` file (in this case, `SmallJava.scope`).

