import * as vscode from 'vscode';
import { CatCodingPanel } from './webview';
import { HostTreeDataProvider, HostConfig } from './treeDataProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "host" is now active!');

	const hostTreeDataProvider = new HostTreeDataProvider(context);

	context.subscriptions.push(vscode.window.registerTreeDataProvider("sword1", hostTreeDataProvider));

	context.subscriptions.push(vscode.commands.registerCommand('sword1.add', (item: HostConfig) => {
		hostTreeDataProvider.add(item);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('sword1.delete', (item: HostConfig) => {
		hostTreeDataProvider.del(item);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('sword1.rename', (item: HostConfig) => {
		hostTreeDataProvider.rename(item);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('sword1.choose', (item: HostConfig) => {
		hostTreeDataProvider.choose(item);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('sword1.unchoose', (item: HostConfig) => {
		hostTreeDataProvider.unchoose(item);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('sword1.start', () => {
		CatCodingPanel.createOrShow(context.extensionUri);
	}));
	//树视图区域点击事件
	const editHandle = vscode.commands.registerCommand('sword1.edit', (params) => {
		CatCodingPanel.createOrShow(context.extensionUri);
	});
	[editHandle].forEach(item=>{
		context.subscriptions.push(item);
	})
	vscode.workspace.onDidSaveTextDocument((e:vscode.TextDocument) => {
		if(e.fileName && e.fileName.indexOf('.host') > -1){
			hostTreeDataProvider.syncChooseHost();
		}
	});
}


// this method is called when your extension is deactivated
export function deactivate() {}




