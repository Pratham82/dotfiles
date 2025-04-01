# IntelliCode API Usage Examples

Ever wish you could easily access code examples for APIs you work with? IntelliCode API Usage Examples makes that a reality. Now with just one click you can access examples for over 100K different APIs!

IntelliCode API Usage Examples is a feature that lets you see real-world examples of how other developers have used a given function. Examples shown are from public open source repositories on GitHub.

This feature currently supports Python, JavaScript and TypeScript (including JSX and TSX files). 

<img width="960px" src="https://aka.ms/IntelliCodeUsageExamplesv2" alt="IntelliCode API Examples. The developer hovers their mouse over a call and a hover window appears. The hover window is scrolled until the IntelliCode API Usage section. The see examples link is clicked and the developer reviews code examples shown in a new untitled editor."/>

## How to use API Usage Examples

1. Open any supported file (PY, TS, JS, JSX and TSX), and hover your mouse over any function call (the call must have open and close parentheses). 
2. You'll see an info window appear, below where you're hovering. If the function you hovered is supported by the feature, a link to "See Real World Examples From GitHub" will appear in that window. Note: you may need to scroll the informational window to see the link.
3. Click on the "See Real World Examples From GitHub" link - a results view will appear displaying code examples grouped by how common the API usage is. The API usage will be highlighted in blue.
4. You can optionally click on the GitHub-labelled hyperlink within the results view to see the example in the context of the originating GitHub repository.

## How does it work?
It uses a scan of public GitHub repositories, which creates a mapping from function names to code snippets. These code snippets represent real world usages of those functions. The mapping is used to provide the examples you see when using the feature, via a web service. When you hover a function, the feature only ever sends the names of functions found in public open source repos to the service. It will never send your own custom function names. You can read more about the privacy characteristics of the feature [here](https://aka.ms/apiexamplesprivacy)