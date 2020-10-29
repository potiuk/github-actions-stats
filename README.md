<p><a href="https://github.com/potiuk/get-workflow-origin/actions">
<img alt="github-actions-stats status"
    src="https://github.com/potiuk/github-actions-stats/workflows/Test%20the%20build/badge.svg"></a>

# Github Actions Stats

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Context and motivation](#context-and-motivation)
- [Inputs and outputs](#inputs-and-outputs)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Development environment](#development-environment)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Context and motivation

GitHub action stats analyses the Build time usage for an organization for GitHub actions. There is
no dashboard for an organization to analyse the usage, but there is an API that allows to get the
current billing cycle information. This Action extracts those stats for all projects belonging to
the organization/owner and produces CSV file showing current usage.

The `owner` input tells which organization to retrieve information from.

# Inputs and outputs

## Inputs

| Input                 | Required | Default      | Comment                                                     |
|-----------------------|----------|--------------|-------------------------------------------------------------|
| `token`               | yes      |              | The github token passed from `${{ secrets.GITHUB_TOKEN }}`  |
| `owner`               | yes      |              | Organization/Person to read the stats from.                 |

## Outputs

| Output              | No `sourceRunId` specified           |
|---------------------|--------------------------------------|
| `stats`             | CSV formatted string of stats        |

## Development environment

It is highly recommended tu use [pre commit](https://pre-commit.com). The pre-commits
installed via pre-commit tool handle automatically linting (including automated fixes) as well
as building and packaging Javascript index.js from the main.ts Typescript code, so you do not have
to run it yourself.

## License
[MIT License](LICENSE) covers the scripts and documentation in this project.
