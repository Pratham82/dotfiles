## 0.25 (2025-03-05)

GitHub Copilot updates from [February 2025](https://code.visualstudio.com/updates/v1_98):

### Copilot Edits

#### Agent mode improvements (Experimental)

Last month, we introduced _agent mode_ for Copilot Edits in [VS Code Insiders](https://code.visualstudio.com/insiders/). In agent mode, Copilot can automatically search your workspace for relevant context, edit files, check them for errors, and run terminal commands (with your permission) to complete a task end-to-end.

> **Note**: Agent mode is available today in [VS Code Insiders](https://code.visualstudio.com/insiders/), and we just started rolling it out gradually in **VS Code Stable**. Once agent mode is enabled for you, you will see a mode dropdown in the Copilot Edits view — simply select **Agent**.

We made several improvements to the UX of tool usages this month:

* Terminal commands are now shown inline, so you can keep track of which commands were run.
* You can edit the suggested terminal command in the chat response before running it.
* Confirm a terminal command with the <kbd>Ctrl+Enter</kbd> shortcut.

<video src="https://code.visualstudio.com/assets/updates/1_98/edit-terminal.mp4" title="Video that shows editing a suggested terminal command in Chat." autoplay loop controls muted></video>

Agent mode autonomously searches your codebase for relevant context. Expand the message to see the results of which searches were done.

![Screenshot that shows the expandable list of search results in Copilot Edits.](https://code.visualstudio.com/assets/updates/1_98/agent-mode-search-results.png)

We've also made various improvements to the prompt and behavior of agent mode:

* The undo and redo actions in chat now undo or redo the last file edit made in a chat response. This is useful for agent mode, as you can now undo certain steps the model took without rolling back the entire chat response.
* Agent mode can now run your build [tasks](https://code.visualstudio.com/docs/editor/tasks) automatically or when instructed to do so. Disable this functionality via the `github.copilot.chat.agent.runTasks` setting, in the event that you see the model running tasks when it should not.

Learn more about [Copilot Edits agent mode](https://code.visualstudio.com/docs/copilot/copilot-edits#_use-agent-mode-preview) or read the [agent mode announcement blog post](https://code.visualstudio.com/blogs/2025/02/24/introducing-copilot-agent-mode).

> **Note**: If you are a Copilot Business or Enterprise user, an administrator of your organization [must opt in](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization#enabling-copilot-features-in-your-organization) to the use of Copilot "Editor Preview Features" for agent mode to be available.

#### Notebook support in Copilot Edits (Preview)

We are introducing notebook support in Copilot Edits. You can now use Copilot to edit notebook files with the same intuitive experience as editing code files. Create new notebooks from scratch, modify content across multiple cells, insert and delete cells, and change cell types. This preview feature provides a seamless workflow when working with data science or documentation notebooks.

> For the best notebook editing experience with Copilot, we recommend using [VS Code Insiders](https://code.visualstudio.com/insiders/) and the pre-release version of GitHub Copilot Chat, where you'll get the latest improvements to this feature as they're developed.

<video src="https://code.visualstudio.com/assets/updates/1_98/notebook_copilot_edits.mp4" title="Video that shows using Copilot Edits to modify a notebook." autoplay loop controls muted></video>

#### Refined editor integration

We have polished the integration of Copilot Edits with code and notebook editors:

* No more scrolling while changes are being applied. The viewport remains in place, making it easier to focus on what changes.
* Renamed the edit review actions from "Accept" to "Keep" and "Discard" to "Undo" to better reflect what’s happening. Changes for Copilot Edits are live, they are applied and saved as they are made and users keep or undo them.
* After keeping or undoing a file, the next file is automatically revealed.

The video demonstrates how edits are applied and saved as they occur. The live preview updates, and the user decided to "Keep" the changes. Undoing and further tweaking is also still possible.

<video src="https://code.visualstudio.com/assets/updates/1_98/edits_editor.mp4" title="Video that shows that changes from Copilot Edits are saved automatically and the user decided to keep them." autoplay loop controls muted></video>

#### Refreshed UI

In preparation for unifying Copilot Edits with Copilot Chat, we've given Copilot Edits a facelift. Files that are attached and not yet sent, are now rendered as regular chat attachments. Only files that have been modified with AI are added to the changed files list, which is located above the chat input part.

With the `chat.renderRelatedFiles` setting, you can enable getting suggestions for related files. Related file suggestions are rendered below the chat attachments.

![Screenshot that shows the updated Copilot Edits attachments and changed files user experience.](https://code.visualstudio.com/assets/updates/1_98/copilot_edits_ui.png)

### Removed Copilot Edits limits

Previously, you were limited to attach 10 files to your prompt in Copilot Edits. With this release, we removed this limit. Additionally, we've removed the client-side rate limit of 14 interactions per 10 minutes.

> Note that service-side usage rate limits still apply.

### Smoother authentication flows in chat

If you host your source code in a GitHub repository, you're able to leverage several features, including advanced code searching, the `@github` chat participant, and more!

However, for private GitHub repositories, VS Code needs to have permission to interact with your repositories on GitHub. For a while, this was presented with our usual VS Code authentication flow, where a modal dialog showed up when you invoked certain functionality (for example, asking `@workspace` or `@github` a question, or using the `#codebase` tool).

To make this experience smoother, we've introduced this confirmation in chat:

![Screenshot that shows the authentication confirmation dialog in Chat, showing the three options to continue.](https://code.visualstudio.com/assets/updates/1_98/confirmation-auth-dialog.png)

Not only is it not as jarring as a modal dialog, but it also has new functionality:

1. **Grant:** you're taken through the regular authentication flow like before (via the modal).
1. **Not Now:** VS Code remembers your choice and won't bother you again until your next VS Code window session. The only exception to this is if the feature needs this additional permission to function, like `@github`.
1. **Never Ask Again:** VS Code remembers your choice and persists it via the `github.copilot.advanced.authPermissions` setting. Any feature that needs this additional permission will fail.

It's important to note that this confirmation does not confirm or deny Copilot (the service) access to your repositories. This is only how VS Code's Copilot experience authenticates. To configure what Copilot can access, please read the docs [on content exclusion](https://docs.github.com/en/copilot/managing-copilot/configuring-and-auditing-content-exclusion/excluding-content-from-github-copilot).

### More advanced codebase search in Copilot Chat

**Setting**: `github.copilot.chat.codesearch.enabled`

When you add `#codebase` to your Copilot Chat query, Copilot helps you find relevant code in your workspace for your chat prompt. `#codebase` can now run tools like text search and file search to pull in additional context from your workspace.

Set `github.copilot.chat.codesearch.enabled` to enable this behavior. The full list of tools is:

* Embeddings-based semantic search
* Text search
* File search
* Git modified files
* Project structure
* Read file
* Read directory
* Workspace symbol search

### Attach problems as chat context

To help with fixing code or other issues in your workspace, you can now attach problems from the Problems panel to your chat as context for your prompt.

Either drag an item from the Problems panel onto the Chat view, type `#problems` in your prompt, or select the paperclip 📎 button. You can attach specific problems, all problems in a file, or all files in your codebase.

### Attach folders as context

Previously, you could attach folders as context by using drag and drop from the Explorer view. Now, you can also attach a folder by selecting the paperclip 📎 icon or by typing `#folder:` followed by the folder name in your chat prompt.

### Collapsed mode for Next Edit Suggestions (Preview)

**Settings**:

* `github.copilot.nextEditSuggestions.enabled`
* `editor.inlineSuggest.edits.showCollapsed:true`

We've added a collapsed mode for NES. When you enable this mode, only the NES suggestion indicator is shown in the left editor margin. The code suggestion itself is revealed only when you navigate to it by pressing <kbd>Tab</kbd>. Consecutive suggestions are shown immediately until a suggestion is not accepted.

<video src="https://code.visualstudio.com/assets/updates/1_98/NEScollapsedMode.mp4" title="Video that shows Next Edit Suggestions collapsed mode." autoplay loop controls muted></video>

The collapsed mode is disabled by default and can be enabled by configuring `editor.inlineSuggest.edits.showCollapsed:true`, or you can enable or disable it in the NES gutter indicator menu.

![Screenshot that shows the Next Edit Suggestions context menu in the editor left margin, highlighting the Show Collapsed option.](https://code.visualstudio.com/assets/updates/1_98/NESgutterMenu.png)

### Change completions model

You could already change the language model for Copilot Chat and Copilot Edits, and now you can also change the model for inline suggestions.

Alternatively, you can change the model that is used for code completions via **Change Completions Model** command in the Command Palette or the **Configure Code Completions** item in the Copilot menu in the title bar.

> **Note:** the list of available models might vary and change over time. If you are a Copilot Business or Enterprise user, your Administrator needs to enable certain models for your organization by opting in to `Editor Preview Features` in the [Copilot policy settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization#enabling-copilot-features-in-your-organization) on GitHub.com.

### Model availability

This release, we added more models to choose from when using Copilot. The following models are now available in the model picker in Visual Studio Code and github.com chat:

* **GPT 4.5 (Preview)**: OpenAI’s latest model, GPT-4.5, is now available in GitHub Copilot Chat to Copilot Enterprise users. GPT-4.5 is a large language model designed with advanced capabilities in intuition, writing style, and broad knowledge. Learn more about the GPT-4.5 model availability in the [GitHub blog post](https://github.blog/changelog/2025-02-27-openai-gpt-4-5-in-github-copilot-now-available-in-public-preview).

* **Claude 3.7 Sonnet (Preview)**: Claude 3.7 Sonnet is now available to all customers on paid Copilot plans. This new Sonnet model supports both thinking and non-thinking modes in Copilot. In initial testing, we’ve seen particularly strong improvements in agentic scenarios. Learn more about the Claude 3.7 Sonnet model availability in the [GitHub blog post](https://github.blog/changelog/2025-02-24-claude-3-7-sonnet-is-now-available-in-github-copilot-in-public-preview/).

### Copilot Vision (Preview)

We're quickly rolling out end-to-end vision support in this version of Copilot Chat. This lets you attach images and interact with images in chat prompts. For example, if you encounter an error while debugging, attach a screenshot of VS Code, and ask Copilot to help you resolve the issue. You might also use it to attach some UI mockup and let Copilot provide some HTML and CSS to implement the mockup.

![Animation that shows an attached image in a Copilot Chat prompt. Hovering over the image shows a preview of it.](https://code.visualstudio.com/assets/updates/1_97/image-attachments.gif)

You can attach images in multiple ways:

* Drag and drop images from your OS or from the Explorer view
* Paste an image from your clipboard
* Attach a screenshot of the VS Code window (select the **paperclip 📎 button** > **Screenshot Window**)

A warning is shown if the selected model currently does not have the capability to handle the file type. The only supported model at the moment will be `GPT 4o`, but support for image attachments with `Claude 3.5 Sonnet` and `Gemini 2.0 Flash` will be rolling out soon as well. Currently, the supported image types are `JPEG/JPG`, `PNG`, `GIF`, and `WEBP`.

### Copilot status overview (Experimental)

**Setting**: `chat.experimental.statusIndicator.enabled`

We are experimenting with a new central Copilot status overview, accessible via the Status Bar. This view shows:

* Quota information if you are a [Copilot Free](https://code.visualstudio.com/blogs/2024/12/18/free-github-copilot) user
* Editor related settings such as Code Completions
* Useful keyboard shortcuts to use other Copilot features

<video src="https://code.visualstudio.com/assets/updates/1_98/copilot-status.mp4" title="Video that shows opening the Copilot status overview from the Status Bar." autoplay loop controls muted></video>

You can enable this new Status Bar entry by configuring the new `chat.experimental.statusIndicator.enabled` setting.

### TypeScript context for inline completions (Experimental)

**Setting**: `chat.languageContext.typescript.enabled`

We are experimenting with enhanced context for inline completions and `/fix` commands for TypeScript files. The experiment is currently scoped to Insider releases and can be enabled with the `chat.languageContext.typescript.enabled` setting.

### Custom instructions for pull request title and description

You can provide custom instructions for generating pull request title and description with the setting `github.copilot.chat.pullRequestDescriptionGeneration.instructions`.  You can point the setting to a file in your workspace, or you can provide instructions inline in your settings:

```
{
  "github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
    {
      "text": "Prefix every PR title with an emoji."
    }
  ]
}
```

Generating a title and description requires the GitHub Pull Requests extension to be installed.

## 0.24 (2025-02-06)

GitHub Copilot updates from [January 2025](https://code.visualstudio.com/updates/v1_97):

## Copilot Next Edit Suggestions (NES) (Preview)

**Setting**: `github.copilot.nextEditSuggestions.enabled`

We're excited to release a new preview feature through which Copilot can help accelerate the way you write code: **Copilot Next Edit Suggestions**.

GitHub Copilot code completions are great at autocomplete, but since most coding activity is editing existing code, it's a natural evolution of completions to also help with edits. Copilot Next Edit Suggestions (aka "Copilot NES") is this evolution of completions.

Based on the edits you're making, Copilot NES both predicts the location of the next edit you'll want to make and what that edit should be. NES suggests future changes relevant to your current work, and you can simply <kbd>Tab</kbd> to quickly navigate and accept suggestions.

You can enable Copilot NES via the VS Code setting `github.copilot.nextEditSuggestions.enabled`.

In the following example, changing the variable name triggers an edit suggestion at another location in the file. As you use the <kbd>Tab</kbd> key to navigate and accept the suggestion, the arrow in the gutter indicates the relative position of the next suggestion.

![Video showing Copilot NES suggesting code edits at another location. The gutter shows an arrow indicating the relative position of the edit.](https://code.visualstudio.com/assets/updates/1_97/nes-arrow-directions.gif)

Depending on the size and type of edit that Copilot suggests, the rendering of the suggestion dynamically change from side-by-side to below the current line. Configure the `editor.inlineSuggest.edits.renderSideBySide:never` setting to always render suggestions below the current line.

Copilot NES is rapidly evolving, and we can't wait to get your feedback via issues in [our repo](https://github.com/microsoft/vscode-copilot-release). You can read our full [Copilot NES docs](https://aka.ms/gh-copilot-nes-docs) for more information and scenarios as we expand the NES experience.

> **Note**: If you are a Copilot Business or Enterprise user, an administrator of your organization [must opt in](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization#enabling-copilot-features-in-your-organization) to the use of previews of Copilot features, in addition to you setting `github.copilot.nextEditSuggestions.enabled` in your editor.

### Copilot Edits

#### Agent mode (Experimental)

We've been working on a new _agent mode_ for Copilot Edits. When in agent mode, Copilot can automatically search your workspace for relevant context, edit files, check them for errors, and run terminal commands (with your permission) to complete a task end-to-end.

![Screenshot that shows agent mode in the Copilot Edits view.](https://code.visualstudio.com/assets/updates/1_97/agent-mode.png)

You can switch between the current edit mode that we've had for a few months and agent mode with the dropdown in the Copilot Edits view. To see the dropdown, enable the `chat.agent.enabled` setting. You can start using agent mode in [VS Code Insiders](https://code.visualstudio.com/insiders/) today. We will gradually be rolling it out to VS Code Stable users. If the setting doesn't show up for you in Stable, then it isn't enabled for you yet.

![Screenshot of the agent mode setting in the Settings editor.](https://code.visualstudio.com/assets/updates/1_97/agent-setting.png)

In agent mode, Copilot runs autonomously, but it can only edit files within your current workspace. When it wants to run a terminal command, it shows you the command and waits for you to review it and select Continue before proceeding.

> **Note**: Copilot Edits may use many chat requests in agent mode, so it will periodically pause and ask you whether to continue. You can customize this with `chat.agent.maxRequests`. This defaults to 15 for Copilot paid users, and 5 for Copilot Free users.

Learn more about [agent mode in Copilot Edits](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-agent-mode-preview) in the VS Code documentation.

#### Copilot Edit general availability

In our VS Code October release, we announced the preview of Copilot Edits. Today, we're now announcing the general availability of Copilot Edits! Copilot Edits is optimized for code editing and enables you to make code changes across multiple files in your workspace, directly from chat.

#### Improved editor controls

Edits can now be accepted and discarded individually, giving you more control. Also new is that the editor controls for edits remain visible when switching to the side-by-side view. This is useful for understanding larger changes.

![Screenshot that shows how to accept an individual change from Copilot Edits in the editor.](https://code.visualstudio.com/assets/updates/1_97/edits-accept-hunk.png)
_Theme: [GitHub Light Colorblind (Beta)](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme) (preview on [vscode.dev](https://vscode.dev/editor/theme/GitHub.github-vscode-theme/GitHub%20Light%20Colorblind%20(Beta)))_

Lastly, we have added a new setting for automatically accepting edit suggestions after a configurable timeout. The setting for that is `chat.editing.autoAcceptDelay`, which specifies the number of seconds after which changes are accepted. The countdown stops when you interact with the accept button or when you start to review changes. This should be familiar to anyone who binge-watches on the weekends.

<video src="https://code.visualstudio.com/assets/updates/1_97/edits-auto-accept.mp4" title="Video showing a gradient on the Accept button for Copilot Edits, indicating the auto-accept progress." autoplay loop controls muted></video>
_Theme: [GitHub Light Colorblind (Beta)](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme) (preview on [vscode.dev](https://vscode.dev/editor/theme/GitHub.github-vscode-theme/GitHub%20Light%20Colorblind%20(Beta)))_

### Apply in editor

In Copilot Chat, any code block can be applied to a file in the workspace by using the **Apply to Editor** action in the toolbar of the code block.
We made several improvements to this experience:

- The hover of the action now shows the file the code block was generated for.

  ![Screenshot that shows the Apply Code Block hover text, indicating the target file name.](https://code.visualstudio.com/assets/updates/1_97/apply-code-block-hover.png)

- If the code block is for a non-existent file, you are prompted where to create the file. This can be at a file path suggested by Copilot, in an untitled editor, or in the currently active editor.

- When the changes are computed and applied, the same flow and UI as for Copilot Edits are used. You can review, improve, or discard each change individually.

### Temporal context

Temporal context helps when editing or generating code by informing the language model about files that you have recently interacted with.

Our experimentation has shown that this yields much better Inline Chat results. Therefore, temporal context is now on by default for Inline Chat. You can configure it via `github.copilot.chat.editor.temporalContext.enabled`.

For Copilot Edits, we are still experimenting, and you can try it by setting `github.copilot.chat.edits.temporalContext.enabled`.

### Workspace index status UI

When you ask Copilot a question about the code in your project by using `@workspace` or `#codebase`, we use an index to quickly and accurately search your codebase for relevant code snippets to include as context. This index can either be a [remote index managed by GitHub](https://code.visualstudio.com/docs/copilot/workspace-context.md#remote-index), [a locally stored index](https://code.visualstudio.com/docs/copilot/workspace-context.md#local-index), or [a basic index](https://code.visualstudio.com/docs/copilot/workspace-context.md#basic-index) used as a fallback for large projects that can't use a remote index.

This iteration, we've added the new workspace index to the language status indicator in the Status Bar that shows the type of index being used by Copilot and related information, such as the number of files being reindexed. To see this, just select the `{}` icon in the VS Code Status Bar.

![Screenshot that shows the status of the Copilot workspace indexing in the Status Bar.](https://code.visualstudio.com/assets/updates/1_97/copilot-workspace-status.png)

Check out the [Copilot workspace docs](https://code.visualstudio.com/docs/copilot/workspace-context.md#managing-the-workspace-index) for more info about the types of workspace indexes and how you can switch between them.

### Build a remote workspace index

[Remote workspace indexes](https://code.visualstudio.com/docs/copilot/workspace-context.md#remote-index) are managed by GitHub. A remote index can provide high-quality results quickly, even for large projects. They also only have to be built once per GitHub project, instead of once per user.

Given all these advantages, we have added several new ways to upgrade a project to a remote index:

- Run the new **GitHub Copilot: Build Remote Index** command.

- Select the Build Index button in the [workspace index status UI](#workspace-index-status-ui). This only shows up if your project is eligible for remote indexing.

- Select the Build Index button in the first `@workspace` response you see. This only shows up if your project is eligible and also only shows once per workspace.

Keep in mind that only projects with a GitHub remote can currently use a remote index. It may also take some time to build up the remote index, especially if your project is large. Check the [Workspace index status UI](#workspace-index-status-ui) to see if remote indexing has completed.

### Workspace search improvements

We've also continued optimizing code search for `@workspace` and `#codebase`. Highlights include:

- Improved tracking and handling of locally changed files when using a [remote index](https://code.visualstudio.com/docs/copilot/workspace-context.md#remote-index).

- Added background updating of changed files in the [local index](https://code.visualstudio.com/docs/copilot/workspace-context.md#local-index), so that `@workspace` questions don't have to wait for them to be updated.

- Optimized the [basic index](https://code.visualstudio.com/docs/copilot/workspace-context.md#basic-index) for large projects.

### Git changes context variable

When writing queries for Chat or Edits, you can now reference files that were modified in Git source control by using the `#changes` context variable. For example, you could prompt for `summarize the #changes in my workspace`.

![Screenshot of a Copilot chat response, which lists the modified files and changes when prompting for '#changes'.](https://code.visualstudio.com/assets/updates/1_97/copilot-chat-git-changes.png)

### Agentic codebase search (Preview)

You can add `#codebase` to your query and Copilot Edits will discover relevant files for your task. We've added experimental support for discovering relevant files using additional tools like file and text search, Git repository state, and directory reads. Previously, `#codebase` only performed semantic search.

You can enable it with `github.copilot.chat.edits.codesearch.enabled`, and please [share any feedback](https://github.com/microsoft/vscode-copilot-release with us.

### Copilot Vision in VS Code Insiders (Preview)

We're introducing end-to-end vision support in the pre-release version of GitHub Copilot Chat in [VS Code Insiders](https://code.visualstudio.com/insiders/). This lets you attach images and interact with images in Copilot Chat prompts. For example, if you're encountering an error while debugging, quickly attach a screenshot of VS Code and ask Copilot to help you resolve the issue.

![Screenshot that shows an attached image in an Copilot Chat prompt. Hovering over the image shows a preview of it.](https://code.visualstudio.com/assets/updates/1_97/image-attachments.gif)

You can now attach images using several methods:

- Drag and drop images from your OS or from the Explorer view
- Paste an image from the clipboard
- Attach a screenshot of the VS Code window (select Attach > Screenshot Window)

A warning is shown if the selected model currently does not have the capability to handle images. The only supported model at the moment will be `GPT 4o`. Currently, the supported image types are `JPEG/JPG`, `PNG`, `GIF`, and `WEBP`.

### Reusable prompts (Experimental)

This feature lets you build, store, and share reusable prompts. A prompt file is a `.prompt.md` Markdown file that follows the same format used for writing prompts in Copilot Chat, and it can link to other files or even other prompts. You can attach prompt files for task-specific guidance, aid with code generation, or keep complete prompts for later use.

To enable prompt files, set `chat.promptFiles` to `true`, or use the `{ "/path/to/folder": boolean }` notation to specify a different path. The `.github/prompts` folder is used by default to locate prompt files (`*.prompt.md`, if no other path is specified.

Learn more about [prompt files](https://aka.ms/vscode-ghcp-prompt-snippets) in the VS Code documentation.

## 0.23 (2024-12-12)

GitHub Copilot updates from [November 2024](https://code.visualstudio.com/updates/v1_96):

### Copilot Edits

Last milestone, we introduced [Copilot Edits](https://code.visualstudio.com/docs/copilot/copilot-edits) (currently in preview), which allows you to quickly edit multiple files at once using natural language. Since then, we've continued to iterate on the experience. You can try out Copilot Edits by opening the Copilot menu in the Command Center, and then selecting Open Copilot Edits, or by triggering <kbd>Ctrl+Shift+I</kbd>.

#### Progress and editor controls

Copilot Edits can make multiple changes across different files. You can now more clearly see its progress as edits stream in. And with the editor overlay controls, you can easily cycle through all changes and accept or discard them.

<video src="https://code.visualstudio.com/assets/updates/1_96/chat-edits.mp4" title="Copilot Edits changing a file" autoplay loop controls muted></video>

#### Move chat session to Copilot Edits

You might use the Chat view to explore some ideas for making changes to your code. Instead of applying individual code blocks, you can now move the chat session to Copilot Edits to apply all code suggestions from the session.

![Edit with Copilot showing for a chat exchange.](https://code.visualstudio.com/assets/updates/1_96/chat-move.png)

#### Working set suggested files

In Copilot Edits, the working set determines the files that Copilot Edits can suggest changes for. To help you add relevant files to the working set, for a Git repo, Copilot Edits can now suggest additional files based on the files you've already added. For example, Copilot Edits will suggest files that are often changed together with the files you've already added.

Copilot shows suggested files alongside the **Add Files** button in the working set. You can also select **Add Files** and then select **Related Files** to choose from a list of suggested files.

<video src="https://code.visualstudio.com/assets/updates/1_96/working-set-suggested-files.mp4" title="Add suggested files to Copilot Edits working set." autoplay loop controls muted></video>

#### Restore Edit sessions after restart

Edit sessions are now fully restored after restarting VS Code. This includes the working set, acceptance state, as well as the file state of all past edit steps.

#### Add to working set from Explorer, Search, and editor

You can add files to your Copilot Edits working set with the new **Add File to Copilot Edits** context menu action for search results in the Search view and for files in the Explorer view. Additionally, you can also attach a text selection to Copilot Edits from the editor context menu.

![Add a file from the explorer view to Copilot Edits](https://code.visualstudio.com/assets/updates/1_96/add-file-to-edits.png)

### Debugging with Copilot

Configuring debugging can be tricky, especially when you're working with a new project or language. This milestone, we're introducing a new `copilot-debug` terminal command to help you debug your programs using VS Code. You can use it by prefixing the command that you would normally run with `copilot-debug`. For example, if you normally run your program using the command `python foo.py`, you can now run `copilot-debug python foo.py` to start a debugging session.

<video src="https://code.visualstudio.com/assets/updates/1_96/copilot-debug.mp4" title="Use the copilot-debug command to debug a Go program." autoplay loop controls muted></video>

After your program exits, you are given options to rerun your program or to view, save, or regenerate the VS Code [launch configuration](https://code.visualstudio.com/docs/editor//debugging#launch-configurations) that was used to debug your program.

![The terminal shows options to rerun, regenerate, save, or the launch config after a debugging session.](https://code.visualstudio.com/assets/updates/1_96/copilot-debug.png)
_Theme: [Codesong](https://marketplace.visualstudio.com/items?itemName=connor4312.codesong) (preview on [vscode.dev](https://vscode.dev/editor/theme/connor4312.codesong))_

#### Tasks Support

Copilot's debugging features, including `copilot-debug` and the `/startDebugging` intent, now generate `preLaunchTask`s as needed for code that needs a compilation step before debugging. This is often the case for compiled languages, such as Rust and C++.

### Add Context

We’ve added new ways to include symbols and folders as context in Copilot Chat and Copilot Edits, making it easier to reference relevant information during your workflow.

#### Symbols

Symbols can now easily be added to Copilot Chat and Copilot Edits by dragging and dropping them from the Outline View or Breadcrumbs into the Chat view.

<video src="https://code.visualstudio.com/assets/updates/1_96/context_symbols_dnd.mp4" title="Dragging and dropping symbols from the outline view and editor breadcrumbs into copilot chat" autoplay loop controls muted></video>

We’ve also introduced symbol completion in the chat input. By typing `#` followed by the symbol name, you’ll see suggestions for symbols from files you've recently worked on.

<video src="https://code.visualstudio.com/assets/updates/1_96/context_symbols_completion.mp4" title="After typing # completions show for files and symbols and further typing enables to filter down the completion items" autoplay loop controls muted></video>

To reference symbols across your entire project, you can use `#sym` to open a global symbols picker.

<video src="https://code.visualstudio.com/assets/updates/1_96/context_symbols_sym.mp4" title="Writing #sym allows to see the completion item #sym to open a global symbol picker" autoplay loop controls muted></video>

#### Folders

Folders can now be added as context by dragging them from the Explorer, Search, or other views into Copilot Chat.

<video src="https://code.visualstudio.com/assets/updates/1_96/context_folder_chat.mp4" title="Dragging and dropping the @types folder into copilot chat and asking how to implement a share provider" autoplay loop controls muted></video>

When a folder is dragged into Copilot Edits, all files within the folder are included in the working set.

<video src="https://code.visualstudio.com/assets/updates/1_96/context_folder_edits.mp4" title="Dragging and dropping a folder into copilot edits adds all files in the folder to copilot edits" autoplay loop controls muted></video>

### Copilot usage graph

VS Code extensions can use the VS Code API to [build on the capabilities of Copilot](https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview). You can now see a graph of an extension's Copilot usage in the Runtime Status view. This graph shows the number of chat requests that were made by the extension over the last 30 days.

![Copilot usage graph in the Runtime Status view](https://code.visualstudio.com/assets/updates/1_96/copilot-usage-chart.png)

### Custom instructions for commit message generation

Copilot can help you generate commit messages based on the changes you've made. This milestone, we added support for custom instructions when generating a commit message. For example, if your commit messages need to follow a specific format, you can describe this in the custom instructions.

You can use the `github.copilot.chat.commitMessageGeneration.instructions` setting to either specify the custom instructions or specify a file from your workspace that contains the custom instructions. These instructions are appended to the prompt that is used to generate the commit message. Get more information on how to [use custom instructions](https://code.visualstudio.com/docs/copilot/copilot-customization.

### Inline Chat

This milestone, we have further improved the user experience of Inline Chat: we made the progress reporting more subtle, while streaming in changes squiggles are disabled, and detected commands are rendered more nicely.

Also, we have continued to improve our pseudo-code detection and now show a hint that you can continue with Inline Chat when a line is mostly natural language. This functionality lets you type pseudo code in the editor, which is then used as a prompt for Inline Chat. You can also trigger this flow by pressing <kbd>Ctrl+I</kbd>.

![Inline Chat hint for a line that is dominated by natural language.](https://code.visualstudio.com/assets/updates/1_96/inline-chat-nl-hint.png)

Additionally, there is a new, experimental, setting to make an Inline Chat hint appear on empty lines. This setting can be enabled via `inlineChat.lineEmptyHint`. By default, this setting is disabled.

### Terminal Chat

Terminal Inline Chat has a fresh coat of paint that brings the look and feel much closer to editor Inline Chat:

![Terminal inline chat looks a lot like editor chat now](https://code.visualstudio.com/assets/updates/1_96/copilot-terminal-chat.png)

Here are some other improvements of note that were made:

* The layout and positioning of the widget is improved and generally behaves better
* There's a model picker
* The buttons on the bottom are now more consistent

### Performance improvements for `@workspace`

When you use [`@workspace`](https://code.visualstudio.com/docs/copilot/workspace-context) to ask Copilot about your currently opened workspace, we first need to narrow the workspace down into a set of relevant code snippets that we can hand off to Copilot as context. If your workspaces is backed by a GitHub repo, we can find these relevant snippets quickly by using Github code search. However, as the code search index tracks the main branch of your repository, we couldn't rely on it for local changes or when on a branch.

This milestone, we've worked bring the speed benefits of Github search to branches and pull requests. This means that we now search both the remote index based on your repo's main branch, along with searching any locally changed files. We then merge these results together, giving Copilot a fast and up to date set of snippets to work with. You can read more about [Github code search and how to enable it](https://docs.github.com/en/enterprise-cloud@latest/copilot/github-copilot-enterprise/copilot-chat-in-github/using-github-copilot-chat-in-githubcom#asking-a-question-about-a-specific-repository-file-or-symbol).

---

## 0.22 (2024-10-29)

GitHub Copilot updates from [October 2024](https://code.visualstudio.com/updates/v1_95):

### Start a code editing session with Copilot Edits

**Setting**: `github.copilot.chat.edits.enabled`

With Copilot Edits, currently in preview, you can start an AI-powered code editing session where you can quickly iterate on code changes. Based on your prompts, Copilot Edits proposes code changes across multiple files in your workspace. These edits are applied directly in the editor, so you can quickly review them in-place, with the full context of the surrounding code.

Copilot Edits is great for when you are building something iteratively. It brings the best of Copilot Chat and Inline Chat together in one experience. Have an ongoing, multi-turn chat conversation on the side, while benefiting from inline code suggestions.

<video src="https://code.visualstudio.com/assets/updates/1_95/copilot-edits-hero.mp4" title="Use Copilot Edits to modify an Express app." autoplay loop controls muted></video>

Get started with Copilot Edits in just three steps:

1. Start an edit session by selecting **Open Copilot Edits** from the Chat menu, or press <kbd>Ctrl+Shift+I</kbd>.

    ![Screenshot showing the Copilot menu in the Command Center, highlighting the Open Edit Session item](https://code.visualstudio.com/assets/updates/1_95/copilot-command-center-open-edit-session.png)

1. Add relevant files to the _working set_ to indicate to Copilot which files you want to work on.

1. Enter a prompt to tell Copilot about the edit you want to make! For example, `Add a simple navigation bar to all pages` or `Use vitest instead of jest`.

Get more details about [Copilot Edits](https://code.visualstudio.com/docs/copilot/copilot-edits) in our documentation. Try it out now and provide your feedback through [our issues](https://github.com/microsoft/vscode-copilot-release/issues)!

### A new place for Chat: Secondary Side Bar

The new default location for the Chat view is the [Secondary Side Bar](https://aka.ms/vscode-secondary-sidebar). By using the Secondary Side Bar, you can have chat open at any time, while you still have other views available to you like the File Explorer or Source Control. This provides you with a more integrated AI experience in VS Code. You can quickly get to chat by using the <kbd>Ctrl+Shift+I</kbd> keyboard shortcut.

![Chat view in its new location after having moved](https://code.visualstudio.com/assets/updates/1_95/chat-new-location.png)

With the introduction of the new Chat menu next to the Command Center, bringing up the Secondary Side Bar with chat is just a click away:

<video src="https://code.visualstudio.com/assets/updates/1_95/chat-video.mp4" title="Chat in Secondary Side Bar." autoplay loop controls muted></video>

The chat menu gives you access to the most common tasks for Copilot Chat. If you wish to hide this menu, a new setting `chat.commandCenter.enabled` is provided.

![Chat Menu](https://code.visualstudio.com/assets/updates/1_95/chat-menu.png)

**Note:** If you had previously installed GitHub Copilot, a view will show up at the location you had Chat before that enables you to restore the Chat view to the old location, if that works better for you.

![Chat view in its old location after having moved](https://code.visualstudio.com/assets/updates/1_95/chat-old-location.png)

### Copilot code reviews

With GitHub Copilot code review in Visual Studio Code, you can now get fast, AI-powered feedback on your code as you write it, or request a review of all your changes before you push. GitHub Copilot code review in Visual Studio Code is currently in preview. Try it out and provide feedback through [our issues](https://github.com/microsoft/vscode-copilot-release/issues).

There are two ways to use Copilot code review in VS Code:

* **Review selection**: for an initial review, select code in the editor and either select **Copilot** > **Review and Comment** from the editor context menu, or use the **GitHub Copilot: Review and Comment** command from the Command Palette. _(This feature is in preview.)_

* **Review changes**: for a deeper review of all uncommitted changes, select the **Copilot Code Review** button in the **Source Control** view, which you can also do in your pull request on GitHub.com. _(Join the [waitlist](https://gh.io/copilot-code-review-waitlist), open to all Copilot subscribers)_

    ![Request review of uncommitted changes](https://code.visualstudio.com/assets/updates/1_95/review_diff.png)

Copilot's feedback shows up as comments in the editor, attached to lines of your code. Where possible, the comments include actionable code suggestions, which you can apply in one action.

![Screenshot showing a comment reviewing a code selection](https://code.visualstudio.com/assets/updates/1_95/reviewing_selection.png)

To learn more about Copilot code review, head to the [GitHub code review documentation](https://gh.io/copilot-code-review-docs).

Copilot can provide review comments that match the specific practices of your team or project, provided you give the right context. When reviewing selections with custom review instructions, you can define those specific requirements via the `github.copilot.chat.reviewSelection.instructions` setting. Similar to [code-generation and test-generation instructions](https://code.visualstudio.com/docs/copilot/copilot-customization), you can either define the instructions directly in the setting, or you can store them in a separate file and reference it in the setting.

The following code snippet shows an example of review instructions:

```json
  "github.copilot.chat.reviewSelection.instructions": [
    {
      "text": "Logging should be done with the Log4j ."
    },
    {
      "text": "Always use the Polly library for fault-handling."
    },
    {
      "file": "code-style.md" // import instructions from file `code-style.md`
    }
  ],
```

An example of the contents of the `code-style.md` file:

```markdown
Private fields should start with an underscore.

A file can only contain one class declaration.
```

### Intent detection in Copilot Chat

**Setting**: `chat.experimental.detectParticipant.enabled`

GitHub Copilot has several built-in chat participants, such as `@workspace`, which also contribute commands to the Chat view. Previously, you had to explicitly specify the chat participant and command in a chat prompt. To make it easier to use chat participants with natural language, we've enabled Copilot Chat to automatically route your question to a suitable participant or chat command.

![Screenshot of Chat view that shows how the '@workspace' participant is automatically detected.](https://code.visualstudio.com/assets/updates/1_93/participant-detection.png)

If the automatically selected participant is not appropriate for your question, you can select the **rerun without** link at the top of the chat response to resend your question to Copilot.

### Control current editor context

Copilot Chat has always automatically included your current selection or the currently visible code as context with your chat request. Large Language Models (LLMs) are generally good at understanding whether a piece of context is relevant. But sometimes, when you ask a question that is not about your current editor, including this context might affect how the model interprets your question.

We now show a special attachment control in the chat input that gives a hint about the editor context and which enables you to toggle whether or not to include the editor context.

![The current editor context control in the chat input, which shows that the context is not included.](https://code.visualstudio.com/assets/updates/1_95/implicit-context.png)

There are no changes to the behavior of the editor context. When the active editor has a selection, then just the selection is included. Otherwise, just the code that is scrolled into view is included. You can still attach other files or the full file by using the paperclip button or by typing `#` in the chat prompt.

### Interactive workspace symbol links

A common use case of Copilot Chat is asking questions about the code in your workspace, such as using `/tests` to generate new unit tests for the selected code or asking `@workspace` to find some specific class or function in your project. This milestone, we added enhanced links for any workspace symbols that Copilot mentions in chat responses. These symbol links can help you better understand Copilot responses and learn more about the symbols used in them.

Symbol links are rendered as little pills in the response, just like the [file links](https://code.visualstudio.com/updates/v1_94#_improved-file-links-in-chat-responses) we added last milestone. To start learn more about a symbol, just seleect the symbol link to jump to that symbol's definition:

<video src="https://code.visualstudio.com/assets/updates/1_95/copilot-symbol-links-overview.mp4" title="Symbols links being rendered in a Copilot response. Clicking on then navigates to the symbol definition." autoplay loop controls muted></video>

You can also hover over the symbol link to see which file the symbol is defined in:

![Hovering over a symbol link to see the file it's defined in](https://code.visualstudio.com/assets/updates/1_95/copilot-symbol-link-hover.png)

To start exploring a symbol in more detail, just right-click on the symbol link to bring up a context menu with options, such as **Go to Implementations** and **Go to References**:

![Using the context menu on a symbol link to learn more about a symbol](https://code.visualstudio.com/assets/updates/1_95/copilot-symbol-link-context-menu.png)

Basic symbol links should work for any language that supports Go to Definition. More advanced IntelliSense options, such Go to Implementations, also require support for that language. Make sure to install language extensions to get the best symbol support for any programming languages used in Copilot responses.

### Fix using Copilot action in the Problem hover

The Problem hover now includes the action to fix the problem using Copilot. This action is available for problems that have a fix available, and the fix is generated by Copilot.

![The Problem hover showing a fix using Copilot action](https://code.visualstudio.com/assets/updates/1_95/copilot-fix-problem-hover.png)

### Workspace indexing

[`@workspace`](https://code.visualstudio.com/docs/copilot/copilot-chat#_workspace) lets you ask questions about code in your current project. This is implemented using either [GitHub's code search](https://github.blog/2023-02-06-the-technology-behind-githubs-new-code-search) or a smart local index that VS Code constructs. This milestone, we added a few more UI elements that let you understand how this workspace index is being used.

First up, the new **GitHub Copilot: Build Local Workspace index** command lets you explicitly start indexing the current workspace. This indexing is normally kicked off automatically the first time you ask a `@workspace` question. With the new command, you can instead start indexing at any time. The command also enables indexing of larger workspaces, currently up to 2000 files (not including ignored files, such as the `node_modules` or `out` directories).

While the index is being built, we now also show a progress item in the status bar:

![A status bar item showing the progress of indexing the current workspace](https://code.visualstudio.com/assets/updates/1_95/copilot-workspace-ui-progress.png)

Indexing workspaces with many hundreds of files can take a little time. If you try to ask an `@workspace` question while indexing is being constructed, instead of waiting, Copilot will try to respond quickly by using a simpler local index that can be built up more quickly. We now show a warning in the response when this happens:

![A warning showing on a response telling the user the Copilot user](https://code.visualstudio.com/assets/updates/1_95/copilot-workspace-ui-warning.png)

Notice that Copilot was still able to answer the question in this case, even though it used the simpler local index instead of the more advanced one. That's often the case, although more ambiguous or complex questions might only be answerable once the smarter index has been constructed. Also keep in mind that if your workspace is backed by a GitHub repository, we can instead use [GitHub's code search](https://github.blog/2023-02-06-the-technology-behind-githubs-new-code-search) to answer questions. That means that code search is used instead of the simpler local index.

### Chat follow-up improvements

The follow-up prompts suggested by Chat are now more concise and only appear on the first turn to make room for the conversation. The new setting **Setting**: `github.copilot.chat.followUps` allows changing this new behavior from `firstOnly` to `always` (every turn) or `never` (disables follow-ups.

### Chat settings updates

As we continue to add new features to GitHub Copilot, we want to make it easier to check out what's new and ready to try out. We've restructured our settings and added support [for tagging preview and experimental settings](#settings-editor-indicator-for-experimental-and-preview-settings).

New features may go through the following early access stages, which are described in the settings editor as follows:

**Experimental** This setting controls a new feature that is actively being developed and may be unstable. It is subject to change or removal.

**Preview** This setting controls a new feature that is still under refinement yet ready to use. Feedback is welcome.

You can check out all of GitHub Copilot's [preview features](https://github.com/microsoft/vscode-copilot-release/blob/HEAD/command:workbench.action.openSettings?%5B%22%40tag%3Apreview%20%40ext%3Agithub.copilot-chat%22%5D) using `@tag:preview` in the Settings editor and all of the [experimental features](https://github.com/microsoft/vscode-copilot-release/blob/HEAD/command:workbench.action.openSettings?%5B%22%40tag%3Aexperimental%20%40ext%3Agithub.copilot-chat%22%5D) using `@tag:experimental`.

### File-based custom instructions enabled by default (Preview)

**Setting**: `github.copilot.chat.codeGeneration.useInstructionFiles`

The newly introduced `.github/copilot-instructions.md` file lets you document code-specific conventions for Copilot in your workspace or repository. With this release, the setting is enabled by default in VS Code, so chat conversations automatically include this file if it is present in the workspace. You can verify which instructions are added to a chat request in the *Used references* list. Learn more about [customizing Copilot with instructions](https://code.visualstudio.com/docs/copilot/copilot-customization).

### Sort by relevance in Semantic Search (Experimental)

**Setting**: `github.copilot.chat.search.semanticTextResults`

Last milestone, we introduced the ability to perform a semantic search using Copilot to get search results that are semantically relevant to your query. We have now improved the search results by sorting them by their relevance. Keyword matches from more relevant snippets are deemed more relevant overall.

---

## 0.21 (2024-10-02)

GitHub Copilot updates from [September 2024](https://code.visualstudio.com/updates/v1_94):

### Switch language models in chat

Previously, we announced that you can [sign up for early access to OpenAI o1 models](https://github.com/o1-waitlist-signup). Once you have access, you will have a [**Copilot Chat model picker**](https://code.visualstudio.com/updates/v1_94#_github-copilot) control in Copilot Chat in VS Code to choose which model version to use for your chat conversations.

![Copilot model picker control in the Chat view enables switching to another language model.](https://code.visualstudio.com/assets/updates/1_94/copilot-model-picker.png)

### Use GPT-4o in Inline Chat

We've upgraded Copilot Inline Chat to GPT-4o, to give you faster, more accurate, and higher-quality code and explanations when you use Chat in the editor.

### Public code matching in chat

You can allow GitHub Copilot to return code that could match publicly available code on GitHub.com. When this functionality is enabled for your [organization subscription](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization#policies-for-suggestion-matching) or [personal subscription](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/managing-copilot-policies-as-an-individual-subscriber#enabling-or-disabling-suggestions-matching-public-code), Copilot code completions already provided you with details about the matches that were detected. We now show you these matches for public code in Copilot Chat as well.

If this is enabled for your organization or subscription, you might see a message at the end of the response with a **View matches** link. If you select the link, an editor opens that shows you the details of the matching code references with more details.

![Chat code referencing example.](https://code.visualstudio.com/assets/updates/1_94/code-references.png)

Get more information about [code referencing in GitHub Copilot](https://github.blog/news-insights/product-news/code-referencing-now-generally-available-in-github-copilot-and-with-microsoft-azure-ai/) on the GitHub Blog.

### File suggestions in chat

In chat input fields you can now type `#<filename>` to get file names suggested and attached. This works in chat locations that support file attachments, such as panel-chat, quick-chat, inline- and notebook-chat.

<video src="https://code.visualstudio.com/assets/updates/1_94/chat-file-complete.mp4" title="File suggestions when typing #filename" autoplay loop controls muted></video>

### Improved file links in chat responses

We've improved rendering of any workspace file paths mentioned in Copilot responses. These paths are very common when asking [`@workspace`](https://code.visualstudio.com/docs/copilot/copilot-chat.md#workspace) questions.

The first thing you'll notice is that paths to workspace files now include a file icon so that the type of file can be easily distinguished (these file icons are based on your current [file icon theme](https://code.visualstudio.com/docs/getstarted/themes.md#file-icon-themes)):

![Paths to workspace files in the response now render using file icons](https://code.visualstudio.com/assets/updates/1_94/copilot-path-overview.png)

These paths are clickable links, so just click on them to open the corresponding file. You can even use drag and and drop to open the file in a new editor group or insert it into a text editor by holding <kbd>shift</kbd> before dropping:

<video src="https://code.visualstudio.com/assets/updates/1_94/copilot-path-dnd.mp4" title="Dragging and dropping a workspace file from copilot into the editor" autoplay loop controls muted></video>

By default these links only show the file name but you can hover over them to see the full file path:

![Hovering over a workspace path to see the full workspace path](https://code.visualstudio.com/assets/updates/1_94/copilot-path-hover.png)

You can also right click on one of these paths to open a context menu with additional commands, including copying a relative path to the resource or revealing it in your operating system's explorer:

![The right context menu for a workspace path](https://code.visualstudio.com/assets/updates/1_94/copilot-path-right-click.png)

We plan to continue improving workspace path rendering in the coming iterations, as well as making similar improvements to symbol names in responses.

### Drag and drop files to add chat context

You can now easily attach additional files as context for a chat prompt by dragging files or editor tabs from the workbench directly into chat. By holding `Shift`, you can drop a file into Inline Chat instead of opening it in the editor to add it as context.

<video src="https://code.visualstudio.com/assets/updates/1_94/copilot-attach-dnd.mp4" title="Dragging files and editors into chat" autoplay loop controls muted></video>

### File attachments included in history

There are multiple ways to attach a file or editor selection as relevant context to your chat request, for example by using the 📎 button or typing `#`. Previously, this context was added only for the current request but was not included in the history of follow-on requests. Now, these attachments are kept in history, so that you can keep asking about them without having to reattach this context.

![persistent file attachments](https://code.visualstudio.com/assets/updates/1_94/file-attachment.png)

### Inline Chat and completions in Python native REPL

The native REPL editor used by the Python extension now supports Copilot Inline Chat and code completions directly in the input box.

<video src="https://code.visualstudio.com/assets/updates/1_94/copilot-in-REPL.mp4" title="Title" autoplay loop controls muted></video>

### Accept and run in notebook

When you use Copilot to generate code in a notebook, you can now accept the response and run it directly from the Inline Chat toolbar.

<video src="https://code.visualstudio.com/assets/updates/1_94/notebook-accept-run.mp4" title="Title" autoplay loop controls muted></video>

### Attach variable in notebook chat requests

When using Copilot in a notebook, you can now attach variables from Jupyter kernel in your requests, via either `#kernelVariable` completions, or by using the **Attach Context** (<kbd>Ctrl+/</kbd>) action from the Inline Chat control. Adding variables gives you more precise control over the context of your requests in Jupyter notebooks.

<video src="https://code.visualstudio.com/assets/updates/1_94/notebook-kernel-variable.mp4" title="Title" autoplay loop controls muted></video>

### Refreshed welcome view and chat input

We've refreshed the chat panel with a clean new welcome view, and we've updated the layout of the chat input. We've added a `@` button to make it easier to find chat participants that are built-in or from chat extensions that you've installed. You can also still find these by typing `/` or `@` as you could before.

![welcome view](https://code.visualstudio.com/assets/updates/1_94/chat-welcome.png)

### Semantic search results

**Setting**: `github.copilot.chat.search.semanticTextResults`

The Search view enables you to perform an exact search across your files. We have now added a semantic search functionality to the Search view that uses Copilot to give search results that are semantically relevant.

Notice in the screenshot that the text results only contain exact matches for "diff view", whereas the GitHub Copilot results also have relevant matches for "merge editor".

<video controls src="https://code.visualstudio.com/assets/updates/1_94/semantic-search-in-search-view.mp4" title="Semantic Search in Search View"></video>

This functionality is still in preview and by default, the setting is not enabled. Try it out and let us know what you think!

### Fix test failure (Preview)

**Setting**: `github.copilot.chat.fixTestFailure.enabled`

We've added specialized logic to help you to diagnose the reasons why unit tests fail. This logic is triggered in some scenarios with `/fix`, and you can also invoke it through the `/fixTestFailure` slash command. The command is enabled in chat by default but can be disabled via the setting `github.copilot.chat.fixTestFailure.enabled`.

### Automated test setup (Experimental)

**Setting**: `github.copilot.chat.experimental.setupTests.enabled`

We added an experimental `/setupTests` slash command that can recommend a testing framework for your workspace, provide steps to setup and configure it, and recommend a VS Code extension to provide [testing integration in VS Code](https://code.visualstudio.com/docs/editor/testing). This can save you time and effort to get started with testing for your code.

When you use the `/tests` command to generate tests for your code, it can recommend `/setupTests` and testing extensions if looks like such an integration has not been set up yet in your workspace.

### Start debugging from Chat (Experimental)

**Setting**: `github.copilot.chat.experimental.startDebugging.enabled`

In this milestone, we made improvements to the experimental `/startDebugging` slash command. This command enables you to easily find or create a launch configuration and start debugging your application seamlessly. When you use `@vscode` in Copilot Chat, `/startDebugging` is now available by default.

![A user types /startDebugging flask app port 3000 in the panel chat and is provided with the launch configuration](https://code.visualstudio.com/assets/updates/1_94/start-debugging.png)

### Chat in Command Center (Experimental)

We are experimenting with a command center entry for chat. It provides quick access to all chat relevant commands, like starting chat or attaching context. You can enable this via `chat.commandCenter.enabled` but note that the command center itself needs to be enabled as well.

![Chat Command Center](https://code.visualstudio.com/assets/updates/1_94/chat-command-center.png)

### Improved temporal context (Experimental)

With the `github.copilot.chat.experimental.temporalContext.enabled` setting, you can instruct Inline Chat to consider files that you have opened or edited recently. We have improved this feature and invite everyone to give it a go.

## Previous release: https://code.visualstudio.com/updates
