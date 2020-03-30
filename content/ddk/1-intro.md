---
title: "Avaloq DDK"
metaTitle: "Avaloq DDK"
metaDescription: "Small introduction to Avaloq DDK"
attachments: 
    - "./summary.jpg"
---

# Overview of DDK
DDK introduces four further DSLs that can help implement DSL implementation. These are all built using 
Xtext and Xbase and is currently working with Xtext version 2.14. The counterparts for each DSL is also present as a feature in Xtext, making them quite comparable. Below is a quick summary of the four features:

![Summary](/summary.jpg)

## Working with DDK
Once the Mwe2 file has been edited, the correct abstract files will be auto-generated. You will have to create your own files for Check, Format, Export and Scope by:

1. Right-click on the desired directory
2. Select `New` -> `File`
3. If `File` is not an option, click on `Other..` and Select `File` from the `General` option.
4. Write your desired file name together with the desired extension (.export or .check or .scope or .format)