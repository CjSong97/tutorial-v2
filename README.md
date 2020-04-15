# Avaloq DDK Tutorial
This is a repository containing a tutorial for the Avaloq DSL Developer Kit. This tutorial will cover some basics of building a DSL with DDK using all 4 languages available through the DDK. 

# Using the tutorial
The tutorial can be used by any machine with NodeJS and npm installed. Once installed, run the following commands in a terminal:
```
git clone https://github.com/CjSong97/tutorial-v2.git
cd tutorial-v2
npm install
npm start
```

# Editing the tutorial
All content should be added to the folder **content**. Pages can be added as either .md or .mdx files. The pages can also be grouped by creating a new folder in the content directory and placing a markdown file in the root directory of content with the same name as the folder. 

Various configurations for the tutorial can be found in the file **config.js** and can be edited to suit your needs.

## Live Code Editor

To render react components for live editing, add the `react-live=true` to the code section. For example:

```javascript react-live=true
<button>Edit my text</button>
```

In the above code, just add `javascript react-live=true` after the triple quote ``` to start rendering react components that can be edited by users.

