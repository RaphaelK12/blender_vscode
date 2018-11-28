import * as path from 'path';
import * as vscode from 'vscode';
import { BlenderWorkspaceFolder } from './blender_folder';

export async function attachPythonDebuggerToBlender(
    port: number, blenderPath: string, scriptsFolder: string, 
    addonPathMappings : {src: string, link: string}[]) {
    let mappings = await getPythonPathMappings(blenderPath, scriptsFolder);
    mappings.push(...addonPathMappings.map(item => ({
        localRoot: item.src,
        remoteRoot: item.link
    })));

    attachPythonDebugger(port, mappings);
}

function attachPythonDebugger(port: number, pathMappings: { localRoot: string, remoteRoot: string }[] = []) {
    let configuration = {
        name: `Python at Port ${port}`,
        request: "attach",
        type: "python",
        port: port,
        host: "localhost",
        pathMappings: pathMappings,
    };
    vscode.debug.startDebugging(undefined, configuration);
}

async function getPythonPathMappings(blenderPath: string, scriptsFolder: string) {
    let mappings = [];
    let blender = await BlenderWorkspaceFolder.Get();
    if (blender !== null) {
        mappings.push({
            localRoot: path.join(blender.uri.fsPath, 'release', 'scripts'),
            remoteRoot: scriptsFolder
        });
    }
    return mappings;
}
