# Using other AI models from inside Claude

A model gateway lets Claude send the same question to other models (Gemini, GPT, local models and others) and read their answers in the same session. Use it to spend less of Claude's budget on routine text work, to use a free API allowance the creator already has, and to get a second opinion.

The protocol below adapts ideas from the multi-model consult skill in the MIT-licensed repository `laurigates/claude-plugins` (its `multi-model-delegation` skill, which works through the PAL MCP server). Read that skill for the engineering details of PAL itself.

## What this plugin does and does not ship

- It ships **no gateway and no keys**. It does not register any MCP server for you. Installing a third-party server that runs on the creator's computer with the creator's API keys is the creator's own decision.
- If the creator has a gateway connected (PAL or any other), the main model and the helper `paper-model-consultant` use it by the rules below.
- If none is connected, skip this file. Use the browser route in `free-tools.md`, or do the work with Claude.

## Setting up a gateway (for the creator, once)

1. Read the server's source and its README first. It runs code locally and sees your keys. Pin a version instead of `@latest` when you can.
2. Put API keys in your own environment variables or the server's own settings. **Never paste a key into a chat**, and never ask Claude to read a key file.
3. Register the server, then check it with `claude mcp list`. The tool names are `mcp__<key>__<tool>`, where `<key>` is the name you registered it under.
4. Some providers have a free API allowance with a personal key (Google AI Studio is one). Limits and terms change and differ by country: read them on the provider's page.

In the example setup of `laurigates/claude-plugins`, the server is `uvx pal-mcp-server`, registered as `pal`, with keys such as `GEMINI_API_KEY` and `OPENAI_API_KEY` taken from the environment, and an optional local model endpoint. Treat that as an example, not a recommendation.

## What to send, and what not

**Good uses:**

- Routine text work that does not need Claude: condensing a long source into notes, reformatting, translating the storyboard rows into English prompt drafts, listing candidate titles. The main model checks a sample of the result.
- A **second opinion** on a script's dialect (is this phrase natural in Gulf or Bahraini speech?) or on a storyboard's clarity, from two models briefed identically.
- Leads for research. Chat models without web access invent names, dates and quotations, so treat every answer as unverified.

**Never:**

- Send private material: the creator's personal details, unpublished work they have not agreed to share, anything about other people. Send only the text the task needs. Content that is already public, or that the creator has said can go, is fine.
- Let a model decide facts, approve Arabic wording, or approve images. Those stay with the main model and the creator.
- Pass a key, a password or a token in a prompt.

## The protocol

1. **Check that the gateway works.** List the models, then send one trivial request ("Reply with OK") to each model you intend to use. A provider can be listed as available with an empty or unexpanded key, and then fail on the first real call.
2. **Brief every model with the identical prompt**, word for word. A different prompt creates differences that come from the wording, not from the problem. Pass long text as a file, not pasted into the prompt.
3. **Keep the first round independent.** Never show one model another's answer.
4. **Prefer models from different providers.** Two models from one provider tend to agree for the wrong reason. Under parallel calls the reported model name can be wrong, so identify the provider from the response's provider field when it exists.
5. **Read the disagreement, not the average.** Where the models agree, they usually agree on what you would have written anyway. Where they split, you have found the decision that matters. Decide it against the approved material (the script, the storyboard, the sources), never by choosing the more confident model.
6. **Graft, do not adopt.** Take the good parts. Say why you rejected the rest.
7. **Verify before using.** Names, dates, numbers and quotations from any model go through the research rules of Stage 3: two independent reliable sources, or they are marked as unverified.
8. **Tell the models not to ask for more.** Add to the brief: "Do not ask for searches or more files. State uncertainty inline." Otherwise some answers are only requests.

## Limits and failures

- **Usage limits.** A provider can stop with a rate or usage-limit error after a few large calls, for the whole key. Budget the calls before sending. When the limit message appears, stop using that provider until it resets and say so. Do not rotate or add keys to get around it.
- **Large attachments** are capped, and the cap differs by model. If a file is too big for the smallest model, build one shorter excerpt file and send that same file to all, rather than trimming per model.
- **An empty answer is not an agreement.** If a model returns nothing useful, record it as failed.
- **A free allowance has conditions.** Check the provider's terms for what the output may be used for.

## Images and video through a gateway

A text gateway does not necessarily generate images or video. Check what the gateway you have actually offers. Image generation through an API usually needs a model and a key that support it, and a script that calls it. If the gateway does not offer it, use the connectors in `tools.md` or the browser route in `free-tools.md`.
