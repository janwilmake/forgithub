# GitHub Tools Powered By URL UX

Here's a list of tools that use the same URL structure as github enabling you to use it by just changing your url.

To navigate to your desired page more easily, go from any 'github.com/_' url to 'forgithub.com/_' and you'll get **quick links**! You can star your favorites, or after you remember them you can visit them directly.

## Editors

- bolt.new - [build apps with AI](https://bolt.new/github.com)
- stackblitz.com - [online IDE](https://stackblitz.com/github.com)
- pr.new - [run with codeflow](https://pr.new/github.com)
- github.dev - [VSCode in the browser](https://github.dev)

## LLM Context

- gitingest.com - [prompt-friendly codebase](https://gitingest.com)
- uithub.com - [prompt-friendly codebase](https://uithub.com)
- github.gg - [chat with codebase](https://github.gg)
- githuq.com - [chat with codebase](https://githuq.com)

## LLM Conversions

- gitpodcast.com - [codebase to podcast](https://gitpodcast.com)
- gitdiagram.com - [codebase to diagram](https://gitdiagram.com)

## APIs

- cache.forgithub.com - [cache of repo metadata](https://cache.forgithub.com)
- log.forgithub.com - [get last commits and contributor info](https://log.forgithub.com)
- zipobject - [Extract any zip over API](https://zipobject.com/github.com)
- config.zipobject.com - [Extract config files](https://config.zipobject.com/github.com)
- domain.zipobject.com - [Find domain for repo](https://domain.zipobject.com/github.com)

## Various

- githubtracker.com [track commits, issues, prs and more](https://githubtracker.com)

# Contributing

Please make a PR for any additional tools with the following requirements:

- follow the same structure in the README
- the tool must at least support the `/[owner]/[repo]/[page]/[branch]/[...path]` url structure or a subset thereof
- bonus points if the tool exposes an [`openapi.json`](https://www.openapis.org/what-is-openapi) at its root

The philosophy of tools for GitHub is to create an open ecosystem of code analysis and transformation for the intelligent internet. We believe that tools should be accessible, data should be open, and together we can drive cost down to zero.

[![](thumb.png)](https://github.com/janwilmake/forgithub/raw/refs/heads/main/demo.mov)

URL UX makes tools highly accessible for both humans and agents. code is the source of SaaS and agents, but we can do much more in a highly automated way than is currently done. Let's build an ecosystem for 'Repo to Anything'.

![](urlux.png)

# CHANGELOG

- 2025-01-12 - created the initial version of forgithub.com
- 2025-01-18 - improved layout
- 2025-01-27 - added og:image and added columns and favicons to website. fixed ci/cd
- 2025-03-14 - improved landingpage to have better clarity on what forgithub does. Also added several API tools.
