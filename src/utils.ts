import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { execSync } from 'child_process'

function useGitCommands(folder: vscode.WorkspaceFolder | undefined) {
  if (!folder) return false
  
  const config = vscode.workspace.getConfiguration('git')
  const repo = config.get<string | boolean>('autoRepositoryDetection')

  if (!repo) return false
  if (repo || repo === 'openEditors') return true

  if (repo === 'subFolders') {
    const gitDir = path.join(folder.uri.fsPath, '.git')
    return fs.existsSync(gitDir)
  }

  return true
}

export function getGitUrl() {
  try {
    const folder = vscode.workspace.workspaceFolders?.[0] ?? undefined
    if (!folder) return null
    
    const gitUrl = useGitCommands(folder)
    return gitUrl
  } catch (error) {
    console.error(error)
    return null
  }
}

export function getGitCurrentBranch() {
  try {
    const folder = vscode.workspace.workspaceFolders?.[0] ?? undefined
    if (!folder) return null

    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: folder.uri.fsPath,
      encoding: 'utf-8',
    })

    return gitBranch.trim()
  } catch (error) {
    console.error(error)
    return null
  }
}
