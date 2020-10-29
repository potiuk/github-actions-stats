import * as github from '@actions/github'
import * as core from '@actions/core'

async function getRepositories(
  octokit: github.GitHub,
  owner: string
): Promise<string[]> {
  const repos = await octokit.paginate(
    await octokit.repos.list({
      affiliation: owner
    })
  )
  const repoNames: string[] = []
  for (const repo of repos) {
    core.info(`Repository: ${repo}`)
    repoNames.push(repo.name)
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
  const owner = core.getInput('owner', {required: true})

  const repoNames = await getRepositories(octokit, owner)
  verboseOutput('repoNames', JSON.stringify(repoNames))
}

run()
  .then(() =>
    core.info(
      '\n############### Github Action Stats complete ##################\n'
    )
  )
  .catch(e => core.setFailed(e.message))
