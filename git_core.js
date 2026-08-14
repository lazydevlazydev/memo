// git_core.js

// Gitリポジトリの仮想状態
const gitState = {
    initialized: false,
    commits: [],
    branch: 'main'
};

// コマンドを解釈して結果を返す関数
function executeGitCommand(cmdText) {
    const args = cmdText.trim().split(/\s+/);
    const command = args[0];
    const subcommand = args[1];

    if (command !== 'git') {
        return { type: 'error', text: `bash: ${command}: command not found` };
    }

    if (!subcommand) {
        return { type: 'error', text: `usage: git [--version] [--help] [-C <path>] <command> [<args>]` };
    }

    // git init の処理
    if (subcommand === 'init') {
        if (gitState.initialized) {
            return { type: 'info', text: 'Reinitialized existing Git repository in /project/.git/' };
        }
        gitState.initialized = true;
        return { type: 'success', text: 'Initialized empty Git repository in /project/.git/' };
    }

    // initされていない場合はエラー
    if (!gitState.initialized) {
        return { type: 'error', text: 'fatal: not a git repository (or any of the parent directories): .git' };
    }

    // git log の処理
    if (subcommand === 'log') {
        if (gitState.commits.length === 0) {
            // Git 2.31以降の実際の空リポジトリでのログ表示エラーを再現
            return { type: 'error', text: `fatal: your current branch '${gitState.branch}' does not have any commits yet` };
        }
        // 今後のコンテンツ用（コミット履歴表示）
        let logOutput = '';
        gitState.commits.forEach(c => {
            logOutput += `commit ${c.hash}\nAuthor: You <you@example.com>\n\n    ${c.message}\n\n`;
        });
        return { type: 'info', text: logOutput.trim() };
    }

    // その他の未定義コマンド
    return { type: 'error', text: `git: '${subcommand}' is not a git command. See 'git --help'.` };
}

// ターミナルへログを追加する共通UIヘルパー
function appendTerminalLog(outputElement, text, className = '') {
    const div = document.createElement('div');
    div.textContent = text;
    if (className) div.className = className;
    outputElement.appendChild(div);
    outputElement.scrollTop = outputElement.scrollHeight;
}
