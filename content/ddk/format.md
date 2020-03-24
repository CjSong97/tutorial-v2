---
title: "Format"
metaTitle: "Format"
metaDescription: "Description of Format DSL"
---

# Example Format Code 
This section will cover some example Format code and prettify the SmallJava implementation
We'll start light and ensure that after SJFields, there is a linewrap.
```javascript
formatter for org.example.smalljava.SmallJava

const int BLOCK_SPACE = 4;

SJField {
    ";": linewrap after;
}

...

```

Next, we will ensure there are 4 spaces after a block is declared, as an IDE usually
would do. To do that, we can declare a local variable to reuse for the number of spaces
we would usually want alloted. This was done in the previous block and must be done at the 
top of the file. While we're at it we'll also add a linewrap after the closing brace.

```javascript

SJBlock {
    '{' : space BLOCK_SPACE before;
    '}' : linewrap after;
}

...
```

# Format for Xtext
Xtext does not automatically generate the Formatter stub files for you. To enable the 
generation of the formatter stub, we need to add some lines to the `.mwe2` file

```javascript
formatter={
    generateStub = true
}
```

After running the `.mwe2` file as a workflow, you can find the Xtend class automatically 
inside the `Abstract<MyDSL>RuntimeModule` of the language and extends the `AbstractFormatter2`
class.

## More Format Rules
For more Format rules and concepts, please refer to [this](https://ddk.tools.avaloq.com/format_guide.html) link
from the Avaloq DDK website. 
