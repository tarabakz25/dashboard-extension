import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'


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
  }
}