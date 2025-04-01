"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoIdentifierInfo = exports.getLocalChanges = exports.getChangesForCommit = exports.getCommitsForAuthors = exports.authors = exports.getInfoForCommit = exports.isMergeCommit = exports.commitAlreadyOnRemote = exports.getLatestCommitForBranch = exports.getDefaultBranchFromRemoteBranch = exports.accumulateNumStatChanges = void 0;
const models_1 = require("../model/models");
const Util_1 = require("../Util");
const CacheManager_1 = require("../cache/CacheManager");
const ExecManager_1 = require("../managers/ExecManager");
const ONE_HOUR_IN_SEC = 60 * 60;
const ONE_DAY_IN_SEC = ONE_HOUR_IN_SEC * 24;
const cacheMgr = CacheManager_1.CacheManager.getInstance();
function accumulateNumStatChanges(results) {
    /*
    //Insert  Delete    Filename
      10      0       src/api/billing_client.js
      5       2       src/api/projects_client.js
      -       -       binary_file.bin
    */
    const diffNumStatList = [];
    for (const result of results) {
        const diffNumStat = new models_1.DiffNumStats();
        const parts = result.split('\t');
        diffNumStat.insertions = Number(parts[0]);
        diffNumStat.deletions = Number(parts[1]);
        // Add backslash to match other filenames in tracking
        diffNumStat.file_name = `/${parts[2]}`;
        if (Number.isInteger(diffNumStat.insertions) && Number.isInteger(diffNumStat.deletions))
            diffNumStatList.push(diffNumStat);
    }
    return diffNumStatList;
}
exports.accumulateNumStatChanges = accumulateNumStatChanges;
async function getDefaultBranchFromRemoteBranch(projectDir, remoteBranch) {
    if (!projectDir || !(0, Util_1.isGitProject)(projectDir)) {
        return '';
    }
    const cacheId = `getDefaultBranchFromRemoteBranch-${(0, Util_1.noSpacesProjectDir)(projectDir)}`;
    let defaultBranchFromRemoteBranch = cacheMgr.get(cacheId);
    if (defaultBranchFromRemoteBranch) {
        return defaultBranchFromRemoteBranch;
    }
    defaultBranchFromRemoteBranch = '';
    const remotes = (0, ExecManager_1.execCmd)('git remote', projectDir, true) || [];
    const remoteName = remotes.sort((a, b) => b.length - a.length).find((r) => remoteBranch.includes(r));
    if (remoteName) {
        // Check if the remote has a HEAD symbolic-ref defined
        const headBranchList = (0, ExecManager_1.execCmd)(`git symbolic-ref refs/remotes/${remoteName}/HEAD`, projectDir, true);
        if (headBranchList.length) {
            // Make sure it's not a broken HEAD ref
            const verify = (0, ExecManager_1.execCmd)(`git show-ref --verify '${headBranchList[0]}'`, projectDir, true);
            if (verify?.length) {
                defaultBranchFromRemoteBranch = headBranchList[0];
            }
        }
        if (!defaultBranchFromRemoteBranch) {
            const assumedDefaultBranch = await guessDefaultBranchForRemote(projectDir, remoteName);
            if (assumedDefaultBranch) {
                defaultBranchFromRemoteBranch = assumedDefaultBranch;
            }
        }
    }
    if (!defaultBranchFromRemoteBranch) {
        // Check if any HEAD branch is defined on any remote
        const remoteBranchesResult = (0, ExecManager_1.execCmd)("git branch -r -l '*/HEAD'", projectDir, true);
        if (remoteBranchesResult?.length) {
            // ['origin/HEAD - origin/main']
            const remoteBranches = remoteBranchesResult[0].split(' ');
            defaultBranchFromRemoteBranch = remoteBranches[remoteBranches.length - 1];
        }
    }
    if (!defaultBranchFromRemoteBranch) {
        const originIndex = remotes.indexOf('origin');
        if (originIndex > 0) {
            // Move origin to the beginning
            remotes.unshift(remotes.splice(originIndex, 1)[0]);
        }
        // Check each remote for a possible default branch
        for (const remote of remotes) {
            const assumedRemoteDefaultBranch = await guessDefaultBranchForRemote(projectDir, remote);
            if (assumedRemoteDefaultBranch) {
                defaultBranchFromRemoteBranch = assumedRemoteDefaultBranch;
            }
        }
    }
    if (defaultBranchFromRemoteBranch) {
        // cache for a day
        cacheMgr.set(cacheId, defaultBranchFromRemoteBranch, ONE_DAY_IN_SEC);
    }
    // We have no clue, return something
    return defaultBranchFromRemoteBranch || '';
}
exports.getDefaultBranchFromRemoteBranch = getDefaultBranchFromRemoteBranch;
async function guessDefaultBranchForRemote(projectDir, remoteName) {
    // Get list of branches for the remote
    const remoteBranchesList = (0, ExecManager_1.execCmd)(`git branch -r -l '${remoteName}/*'`, projectDir, true) || [];
    const possibleDefaultBranchNames = ['main', 'master'];
    let assumedDefault;
    for (const possibleDefault of possibleDefaultBranchNames) {
        assumedDefault = remoteBranchesList.find((b) => b.trim() === `${remoteName}/${possibleDefault}`);
        if (assumedDefault)
            break;
    }
    return assumedDefault?.trim();
}
async function getLatestCommitForBranch(projectDir, branch) {
    const cmd = `git rev-parse ${branch}`;
    if (!projectDir || !(0, Util_1.isGitProject)(projectDir)) {
        return '';
    }
    const resultList = (0, ExecManager_1.execCmd)(cmd, projectDir, true);
    return resultList?.length ? resultList[0] : '';
}
exports.getLatestCommitForBranch = getLatestCommitForBranch;
async function commitAlreadyOnRemote(projectDir, commit) {
    const resultList = (0, ExecManager_1.execCmd)(`git branch -r --contains ${commit}`, projectDir, true);
    // If results returned, then that means the commit exists on
    // at least 1 remote branch, so return true.
    return resultList?.length ? true : false;
}
exports.commitAlreadyOnRemote = commitAlreadyOnRemote;
async function isMergeCommit(projectDir, commit) {
    const resultList = (0, ExecManager_1.execCmd)(`git rev-list --parents -n 1 ${commit}`, projectDir, true);
    const parents = resultList?.[0]?.split(' ');
    // If more than 2 commit SHA's are returned, then it
    // has multiple parents and is therefore a merge commit.
    return parents?.length > 2 ? true : false;
}
exports.isMergeCommit = isMergeCommit;
async function getInfoForCommit(projectDir, commit) {
    const resultList = (0, ExecManager_1.execCmd)(`git show ${commit} --pretty=format:"%aI" -s`, projectDir, true);
    return { authoredTimestamp: resultList?.length ? resultList[0] : '' };
}
exports.getInfoForCommit = getInfoForCommit;
// Returns an array of authors including names and emails from the git config
async function authors(projectDir) {
    if (!projectDir || !(0, Util_1.isGitProject)(projectDir)) {
        return [];
    }
    const cacheId = `git-authors-${(0, Util_1.noSpacesProjectDir)(projectDir)}`;
    let authors = cacheMgr.get(cacheId);
    if (authors) {
        return authors;
    }
    const configUsers = (0, ExecManager_1.execCmd)(`git config --get-regex "^user\\."`, projectDir, true);
    authors = configUsers?.length
        ? configUsers.map((configUser) => {
            let [_, ...author] = configUser.split(' ');
            return author.join(' ');
        })
        : [];
    const uniqueAuthors = authors.filter((author, index, self) => {
        return self.indexOf(author) === index;
    });
    cacheMgr.set(cacheId, uniqueAuthors, ONE_HOUR_IN_SEC);
    return uniqueAuthors;
}
exports.authors = authors;
async function getCommitsForAuthors(projectDir, branch, startRef, authors) {
    if (!projectDir || !(0, Util_1.isGitProject)(projectDir)) {
        return [];
    }
    // If there is no startRef, then only pull 2 weeks of history
    const range = startRef !== '' ? `${startRef}..HEAD` : `HEAD --since="2 weeks ago"`;
    let cmd = `git log ${branch} ${range} --no-merges --pretty=format:"%aI =.= %H"`;
    for (const author of authors) {
        cmd += ` --author="${author}"`;
    }
    const resultList = (0, ExecManager_1.execCmd)(cmd, projectDir, true);
    if (resultList?.length) {
        return resultList.map((result) => {
            const [authoredTimestamp, commit] = result.split(' =.= ');
            return { commit, authoredTimestamp };
        });
    }
    return [];
}
exports.getCommitsForAuthors = getCommitsForAuthors;
async function getChangesForCommit(projectDir, commit) {
    if (!projectDir || !(0, Util_1.isGitProject)(projectDir) || !commit) {
        return [];
    }
    const cmd = `git diff --numstat ${commit}~ ${commit}`;
    const resultList = (0, ExecManager_1.execCmd)(cmd, projectDir, true);
    if (resultList?.length) {
        // just look for the line with "insertions" and "deletions"
        return accumulateNumStatChanges(resultList);
    }
    return [];
}
exports.getChangesForCommit = getChangesForCommit;
async function getLocalChanges(projectDir) {
    if (!projectDir || !(0, Util_1.isGitProject)(projectDir)) {
        return [];
    }
    const cmd = `git diff --numstat`;
    const resultList = (0, ExecManager_1.execCmd)(cmd, projectDir, true);
    if (resultList?.length) {
        // just look for the line with "insertions" and "deletions"
        return accumulateNumStatChanges(resultList);
    }
    return [];
}
exports.getLocalChanges = getLocalChanges;
function stripOutSlashes(str) {
    var parts = str.split('//');
    return parts.length === 2 ? parts[1] : str;
}
function stripOutAmpersand(str) {
    var parts = str.split('@');
    return parts.length === 2 ? parts[1] : str;
}
function replaceColonWithSlash(str) {
    return str.replace(':', '/');
}
function normalizeRepoIdentifier(identifier) {
    if (identifier) {
        // repos['standardId'] = repos['identifier']
        // repos['standardId'] = repos['standardId'].str.split('\//').str[-1].str.strip()
        // repos['standardId'] = repos['standardId'].str.split('\@').str[-1].str.strip()
        // repos['standardId'] = repos['standardId'].str.replace(':', "/")
        identifier = stripOutSlashes(identifier);
        identifier = stripOutAmpersand(identifier);
        identifier = replaceColonWithSlash(identifier);
    }
    return identifier || '';
}
/**
 * Retrieve the github org name and repo name from the identifier
 * i.e. https://github.com\\swdotcom\\swdc-codemetrics-service.git
 * would return "swdotcom"
 * Returns: {identifier, org_name, repo_name}
 */
function getRepoIdentifierInfo(identifier) {
    identifier = normalizeRepoIdentifier(identifier);
    if (!identifier) {
        // no identifier to pull out info
        return { identifier: '', org_name: '', repo_name: '' };
    }
    // split the identifier into parts
    const parts = identifier.split(/[\\/]/);
    // it needs to have at least 3 parts
    // for example, this shouldn't return an org "github.com//string.git"
    let owner_id = '';
    const gitMatch = parts[0].match(/.*github.com/i);
    if (parts && parts.length > 2 && gitMatch) {
        // return the 2nd part
        owner_id = parts[1];
    }
    let repo_name = '';
    if (parts && parts.length > 2 && identifier.indexOf('.git') !== -1) {
        // https://github.com/swdotcom/swdc-atom.git
        // this will return "swdc-atom"
        repo_name = identifier.split('/').slice(-1)[0].split('.git')[0];
    }
    return { identifier, owner_id, repo_name };
}
exports.getRepoIdentifierInfo = getRepoIdentifierInfo;
//# sourceMappingURL=GitUtil.js.map