import * as github from '@actions/github'
import * as core from '@actions/core'

async function getRepositories(
  octokit: github.GitHub,
  org: string
): Promise<string[]> {
  const repos = await octokit.repos.listForOrg({
    org
  })
  const repoNames: string[] = []
  const maxNum = 20
  let num = 0
  for (const repo of repos) {
    core.info(`Repository: ${repo.name}`)
    repoNames.push(repo.name)
    num += 1
    if (maxNum > 0 && num === maxNum) {
      break
    }
  }
  return repoNames
}

function verboseOutput(name: string, value: string): void {
  core.info(`Setting output: ${name}: ${value}`)
  core.setOutput(name, value)
}

async function run(): Promise<void> {
  const token = core.getInput('token', {required: true})
  const octokit = new github.GitHub(token)
  const org = core.getInput('org', {required: true})

  core.info(`Retrieving repositories for ${org}`)
  const repoNames = await getRepositories(octokit, org)
  verboseOutput('repoNames', JSON.stringify(repoNames))
}

run()
  .then(() =>
    core.info(
      '\n############### Github Action Stats complete ##################\n'
    )
  )
  .catch(e => core.setFailed(e.message))
