import * as vscode from 'vscode';
import { FileUtil } from './utils/fileUtil'

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

/**
 * Manages cat coding webview panels
 */
 export class Sword1Pannel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: Sword1Pannel | undefined;

	public static readonly viewType = 'sword1';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (Sword1Pannel.currentPanel) {
			Sword1Pannel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			Sword1Pannel.viewType,
			'V3 中台系统模板生成',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		Sword1Pannel.currentPanel = new Sword1Pannel(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		Sword1Pannel.currentPanel = new Sword1Pannel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update();

		//postMessage to webview
		this._panel.webview.postMessage({
			rootPath:vscode.workspace.workspaceFolders[0].uri.fsPath
		})

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			async message => {
				console.log('post:',message)
				const res  = await FileUtil.createFolderByTemp(message);
				vscode.window.showInformationMessage(res.message ?? res)
				return;
			},
			null,
			this._disposables
		);
	}

	public doRefactor() {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'refactor' });
	}

	public dispose() {
		Sword1Pannel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;

		// Vary the webview's content based on where it is located in the editor.
		switch (this._panel.viewColumn) {
			case vscode.ViewColumn.Two:
				this._updateForCat(webview);
				return;

			case vscode.ViewColumn.Three:
				this._updateForCat(webview);
				return;

			case vscode.ViewColumn.One:
			default:
				this._updateForCat(webview);
				return;
		}
	}

	private _updateForCat(webview: vscode.Webview) {
		// this._panel.title = catName;
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// console.log('workspaceFolder:',workspaceFolder);
		// Local path to main script run in the webview
		const chunkJsPath = vscode.Uri.joinPath(this._extensionUri, 'media/js', 'chunk-vendors.js');
		const appJsPath = vscode.Uri.joinPath(this._extensionUri, 'media/js', 'app.js');

		// And the uri we use to load this script in the webview
		const chunkJs = webview.asWebviewUri(chunkJsPath);
		const appJs = webview.asWebviewUri(appJsPath);

		// Local path to css styles
		const chunkCssPath = vscode.Uri.joinPath(this._extensionUri, 'media/css', 'chunk-vendors.css');
		const appCssPath = vscode.Uri.joinPath(this._extensionUri, 'media/css', 'app.css');

		// Uri to load styles into webview
		const chunkCss = webview.asWebviewUri(chunkCssPath);
		const appCss = webview.asWebviewUri(appCssPath);
		console.log('chunkCss:',chunkCss)
		console.log('scriptUri:',chunkJs)
		console.log('vscode.workspaceFolders:',vscode.workspace.workspaceFolders[0].uri.fsPath);
		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return `<!doctype html>
		<html lang="">
		
		<head>
			<meta charset="utf-8">
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="icon" href="/favicon.ico">
			<title>sword-form</title>
			<script nonce="${nonce}" defer="defer" src="${chunkJs}"></script>
			<script nonce="${nonce}" defer="defer" src="${appJs}"></script>
			<link href="${chunkCss}" rel="stylesheet">
			<link href="${appCss}" rel="stylesheet">
		</head>
		
		<body><noscript><strong>We're sorry but sword-form doesn't work properly without JavaScript enabled. Please enable it to
					continue.</strong></noscript>
			<div id="app"></div>
		</body>
		
		</html>`;
	}
	
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
