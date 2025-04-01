"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourceInfo = void 0;
const Util_1 = require("../Util");
const CacheManager_1 = require("../cache/CacheManager");
const ExecManager_1 = require("../managers/ExecManager");
const cacheMgr = CacheManager_1.CacheManager.getInstance();
const cacheTimeoutSeconds = 60 * 15;
//
// use "git symbolic-ref --short HEAD" to get the git branch
// use "git config --get remote.origin.url" to get the remote url
async function getResourceInfo(projectDir) {
    if (!projectDir || !(0, Util_1.isGitProject)(projectDir)) {
        return null;
    }
    const noSpacesProjDir = projectDir.replace(/^\s+/g, '');
    const cacheId = `resource-info-${noSpacesProjDir}`;
    let resourceInfo = cacheMgr.get(cacheId);
    // return from cache if we have it
    if (resourceInfo) {
        return resourceInfo;
    }
    resourceInfo = {};
    const branch = (0, ExecManager_1.execCmd)('git symbolic-ref --short HEAD', projectDir);
    // returns something like: ['origin\thttps://github.com/swdotcom/swdc-vscode.git (fetch)', 'origin\thttps://github.com/swdotcom/swdc-vscode.git (push)']
    const remotes = (0, ExecManager_1.execCmd)('git remote -v', projectDir, true);
    // find a line that starts with 'origin'
    const origin_remote = remotes.find((line) => line.startsWith('origin\t'));
    const remote_name = origin_remote ? 'origin' : remotes[0].split('\t')[0];
    const identifier = (0, ExecManager_1.execCmd)(`git remote get-url ${remote_name}`, projectDir);
    let email = (0, ExecManager_1.execCmd)('git config user.email', projectDir);
    const tag = (0, ExecManager_1.execCmd)('git describe --all', projectDir);
    // both should be valid to return the resource info
    if (branch && identifier) {
        resourceInfo = { branch, identifier, email, tag };
        cacheMgr.set(cacheId, resourceInfo, cacheTimeoutSeconds);
    }
    return resourceInfo;
}
exports.getResourceInfo = getResourceInfo;
//# sourceMappingURL=KpmRepoManager.js.map