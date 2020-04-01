---
title: "Introduction"
---

This tutorial aims to get the user comfortable to working with the Avaloq Domain-Specific Language (DSL) Development Kit (DDK) by working through an example domain model like SmallJava and using the different DSLs available in the DDK.  We will begin by installing the Avaloq DDK and introducing the grammar models for the DSLs which will be made. 
By writing the DSLs in both Xtext and Avaloq DDK, the user should be able to decide whether the DDK suits the users needs better than Xtext.

# Preface
This tutorial will use material from the book "Implementing Domain-Specific Languages
with Xtext and Xtend" and assumes a lot of prior knowledge about the DSL created in this book.
A lot of the basic features of DDK will be explained in the linked website from Avaloq at 
the bottom of the page. For the purposes of this tutorial, the SmallJava grammar as well as other 
utility files will be linked and should be installed as advised in the installation. If any information seems too confusing, there will be a troubleshooting section for common
issues as well as (my attempt at) explanations of more complex concepts used in this tutorial.

## What should I expect by completing this tutorial?
You will learn the following:
- How to build your own DSL
- Basic understanding of the tools provided by 2 different DSL builders: Xtext and Avaloq DDK
- A working DSL called SmallJava

## How long is this tutorial?
This tutorial should last less than two hours.

# Installation

### Installing Avaloq DDK
For now, there is not a way to install the DDK as software directly into Eclipse. If development were complete,
there would be a way to install DDK as software under the `Install New Software` tab from within Eclipse. However,
for now you will have to install the DDK as plugins from an outside repository into Eclipse. Please follow the 
instructions below:

### Eclipse Setup
Avaloq DDK is tested to be compatible with Eclipse Oxygen. Download Eclipse from this [link](https://www.eclipse.org/oxygen/) and follow the instructions
on the website. After installing Eclipse, install the _Xtext Complete SDK - version 2.14_ in Eclipse. This can be done by:

1. Going to `Help` -> `Install New Software`
2. Copy [this link](http://download.eclipse.org/modeling/tmf/xtext/updates/composite/releases/) and paste it into the `Work with:` box -> click `Add`
3. Once added, uncheck the `Show only the latest version of available software` box
4. Under Xtext, find `Xtext Complete SDK 2.14` -> Click `Finish`
5. You should now have installed Xtext



## DDK Setup
To begin using Avaloq DDK, please follow the following instructions carefully to ensure that all the DSLs
are correctly installed.

### Cloning the DDK plugins
1. With your Eclipse open, go to File -> Import -> Git -> Projects from Git -> Next
2. Select `URI` and click `Next`
3. Now enter the repository's clone URI from [this link](https://github.com/CjSong97/ddk-source).
4. Select clone all branches and click `Finish`


### DDK Runtime
Once the DDK plugins have been successfully cloned, proceeed to click on `Run` -> `Run History` -> `devkit-run` and you should eventually 
find another Eclipse (Neon) instance runnning in another window. In this Eclipse instance is where we will be building our DSL using the Avaloq DDK.
I will refer to this instance as the DDK runtime.

//(perhaps place links to sections in the troubleshooting to explain the difficult concepts like mwe2 editing and explain what mwe2 does)

### Making your SmallJava Project
To demonstrate the Avaloq DDK, we will need to create an Xtext project to make our SmallJava DSL. Follow the steps below to create a new 
Xtext project for SmallJava.

1. In the DDK runtime, navigate to `File` -> `New` -> `Project` -> `Xtext` and click on `Xtext Project`
2. Fill in the following fields: 
    - Project name: org.example.smalljava 
    - Name: org.example.smalljava.SmallJava
    - Extensions: smalljava
3. Click `Finish`

Allow the project wizard to run and it will create 5 different projects in your workspace. Once finished you should see the `SmallJava.xtext` file
opened in the current editing view. Now you should have:
- An Eclipse with DDK plugins imported from the Github repository
- A DDK runtime
- A brand new Xtext project named SmallJava
We will mostly be working in the folder called `org.example.smalljava`.


You are now ready to start implementing your own DSL named SmallJava!