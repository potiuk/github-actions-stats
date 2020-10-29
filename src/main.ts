import * as github from '@actions/github'
import * as core from '@actions/core'

async function getWorkflows(
  octokit: github.GitHub,
  org: string,
  repo: string
): Promise<[string, string][]> {
  const workflows = await octokit.paginate(
    await octokit.actions.listRepoWorkflows({
      owner: org,
      repo
    })
  )
  const workflowIds: [string, string][] = []
  for (const workflow of workflows) {
    const timing = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing',
      {
        owner: org,
        repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        workflow_id: workflow.id
      }
    )
    workflowIds.push([workflow.id, workflow.name])
    core.info(
      `Workflow ID: ${workflow.id}, Name: ${
        workflow.name
      }, Timing: ${JSON.stringify(timing.data)}`
    )
  }
  return workflowIds
}

async function getRepositories(
  octokit: github.GitHub,
  org: string
): Promise<Record<string, [string, string][]>> {
  const repos = await octokit.repos.listForOrg({
    org
  })
  const reposWithWorkflows: Record<string, [string, string][]> = {}
  const maxNum = 20
  let num = 0
  for (const repo of repos.data) {
    const workflows = await getWorkflows(octokit, org, repo.name)
    if (workflows.length > 0) {
      reposWithWorkflows[repo.name] = workflows
      num += 1
      if (maxNum > 0 && num === maxNum) {
        break
      }
      core.info(`Adding repository: ${repo.name} with workflows: ${workflows}`)
    } else {
      core.debug(`Skip repository: ${repo.name} as there are no workflows`)
    }
  }
  return reposWithWorkflows
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
