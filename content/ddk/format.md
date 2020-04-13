---
title: "Format and Formatting"
metaTitle: "Format"
metaDescription: "Description of Format DSL"
---

## Example Format Code 
This section will cover some example Format code and prettify the SmallJava implementation
We'll start light and ensure that after the keyword `;` for SJFields, there is a linewrap.
```javascript
formatter for org.example.smalljava.SmallJava

const int BLOCK_SPACE = 4;

SJField {
    ";": linewrap after;
}
```

Notice that the format file starts with the header of `formatter for org.example.smalljava.SmallJava`. We also declare a variable called `BLOCK_SPACE` at the top of the file.

Next, we will ensure there are 4 spaces after a block is declared (indenting after a block), as an IDE usually would do. To do that, we can declare a local variable to reuse for the number of spaces we would usually want alloted. This was done in the previous block and must be done at the 
top of the file. While we're at it we'll also add a linewrap after the closing brace.

```javascript
...
SJBlock {
    '{' : space BLOCK_SPACE before;
    '}' : linewrap after;
}

...
```

# Format for Xtext
Xtext does not automatically generate the Formatter2 stub files for you. This is written with the new formatting API that was introduced to Xtext as of 2.08. To enable the generation of the formatter2 stub, we need to add some lines to the `.mwe2` file within the `language` block and after `fileExtensions`.

```javascript
formatter={
    generateStub = true
    generateXtendStub = true
}
```

After running the `.mwe2` file as a workflow, you can find the Xtend class automatically in the directory `org.example.smalljava.formatting2.SmallJavaFormatter`.

Say we want to run the same rules as above using Formatter2:

```javascript
var BLOCK_SPACE = 4
...
def dispatch void format(SJClass class, extension IFormattableDocument document) {
    class.regionFor.keyword(";").append[newLine]
}

def dispatch void format(SJBlock block, extension IFormattableDocument document) {
    block.regionFor.keyword("{").prepend[space]
    block.regionFor.keyword("}").append[newLine]
}
...
```

## Using Formatting
`Ctrl+Shift+F` will automatically format your DSL according to the rules set in .format or using Formatting2 for Xtext. 

## More Format Rules
For more Format rules and concepts, please refer to [this](https://ddk.tools.avaloq.com/format_guide.html) link from the Avaloq DDK website. 
