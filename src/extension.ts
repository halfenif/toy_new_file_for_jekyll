// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {v4 as uuidv4} from 'uuid';
import * as fs from 'fs';
import * as path from 'path';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('new-file-for-jekyll.newfile', async (uri: vscode.Uri) => {

		// Check if the selected resource is a folder
		if (uri && uri.scheme === 'file') {
			//vscode.window.showInformationMessage(`Folder selected: ${uri.fsPath}`);
		} else {
			vscode.window.showErrorMessage('The selected resource is not a folder.');
			return;
		}

		const currentDate = new Date();
		let strYear  = currentDate.getFullYear();
		let strMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
		let strDay   = currentDate.getDate().toString().padStart(2, "0");
		let strHour   = currentDate.getHours().toString().padStart(2, "0");
		let strMinute   = currentDate.getMinutes().toString().padStart(2, "0");
		let strSecond   = currentDate.getSeconds().toString().padStart(2, "0");
		  
		let fileName = `${strYear}-${strMonth}-${strDay}_${strHour}${strMinute}${strSecond}.md`;
		let filePath = uri.fsPath + "/" + fileName;

		let strUUID = uuidv4();

		let strBaseName = path.basename(uri.fsPath);

		//-------------------------
		let templateContent = `---
layout: post
title: 
date: ${strYear}-${strMonth}-${strDay} ${strHour}:${strMinute}:${strSecond} +0900
categories: ${strBaseName}
tags: ${strBaseName}
description: 
---

# Link Sample
[Link Name](https://url)

# Image Sample
| ![1](/assets/images/${strYear}-${strMonth}-${strDay}-01-01.png) |
| :------------------------------------: |
|   Image Desc.    |


![Read Count]({%- include count_url.html -%}${strUUID})
`;

		try {
		fs.writeFileSync(filePath, templateContent);
		
		} catch(error) {
		let message = "Unknown Error";
		if (error instanceof Error) {
			message = error.message;			
			vscode.window.showErrorMessage('Failed to write to file: ' + message);
			return;
		}
		}

		const document = await vscode.workspace.openTextDocument(filePath);
		await vscode.window.showTextDocument(document);

		  //Refresh
		//   vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer')
		//   .then(
		// 	() => vscode.window.showInformationMessage(`${fileName} is created`),
		// 	err => vscode.window.showErrorMessage('Failed to refresh Explorer: ' + err.message)
		//   );		  
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
