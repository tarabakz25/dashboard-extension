import * as vscode from 'vscode'
import { tracker } from './tracker'

export function activate(context: vscode.ExtensionContext) { 
  vscode.commands.registerCommand('timestamp.api.signIn', () => {
    tracker.signIn()
  })
  vscode.commands.registerCommand('timestamp.goToDashboard', () => {
    vscode.env.openExternal(vscode.Uri.parse('https://timestamp.dev'))
  })
}

export function deactivate() {
  if (tracker) {
    tracker.signOut()
  }
}