import {useState} from 'react';
import {Check, CheckCircle2, Copy, ExternalLink, GitBranch, Globe, Play, RotateCcw} from 'lucide-react';

interface DeployWorkflowProps {
  onCompleteGitHub: () => void;
  onCompleteNetlify: () => void;
}

type WorkflowTab = 'github' | 'netlify';

const GIT_STAGE_LABELS = [
  '工作目錄（Working Tree）',
  '暫存區（Staging Area）',
  '本地儲存庫（Local Commit）',
  'GitHub 遠端儲存庫（Remote）',
];

const NETLIFY_STAGE_LABELS = [
  '連結 GitHub 儲存庫',
  '執行 npm run build 打包',
  '發佈 dist/ 至全球節點',
];

export function DeployWorkflow({
  onCompleteGitHub,
  onCompleteNetlify,
}: DeployWorkflowProps) {
  const [activeTab, setActiveTab] = useState<WorkflowTab>('github');
  const [githubUser, setGithubUser] = useState<string>('student-dev');
  const [repoName, setRepoName] = useState<string>('python-oop-learning');
  const [gitStage, setGitStage] = useState<number>(0);
  const [netlifyStage, setNetlifyStage] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const safeUser = githubUser.trim() || 'student-dev';
  const safeRepo = repoName.trim() || 'python-oop-learning';
  const repoUrl = `https://github.com/${safeUser}/${safeRepo}.git`;
  const netlifyUrl = `https://${safeRepo}.netlify.app`;

  const gitCommands = [
    {
      id: 'init',
      stageTarget: 0,
      label: '1. 初始化 Git 儲存庫',
      cmd: 'git init',
    },
    {
      id: 'add',
      stageTarget: 1,
      label: '2. 將學習網頁檔案加入暫存區',
      cmd: 'git add .',
    },
    {
      id: 'commit',
      stageTarget: 2,
      label: '3. 提交版本紀錄',
      cmd: 'git commit -m "建立 Python 類別與物件學習網頁"',
    },
    {
      id: 'branch',
      stageTarget: 2,
      label: '4. 確認主分支為 main',
      cmd: 'git branch -M main',
    },
    {
      id: 'remote',
      stageTarget: 3,
      label: '5. 綁定 GitHub 遠端網址',
      cmd: `git remote add origin ${repoUrl}`,
    },
    {
      id: 'push',
      stageTarget: 3,
      label: '6. 推送程式碼到 GitHub',
      cmd: 'git push -u origin main',
    },
  ];

  const allGitBlock = gitCommands.map((item) => item.cmd).join('\n');

  const netlifyToml = `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const advanceGitStage = () => {
    setGitStage((prev) => {
      const next = Math.min(3, prev + 1);
      if (next === 3) {
        onCompleteGitHub();
      }
      return next;
    });
  };

  const advanceNetlifyStage = () => {
    setNetlifyStage((prev) => {
      const next = Math.min(2, prev + 1);
      if (next === 2) {
        onCompleteNetlify();
      }
      return next;
    });
  };

  return (
    <section id="deploy-guide" className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-sky-700">
              04. 課程步驟二與步驟三
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              上傳到 GitHub 與佈署到 Netlify
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              完成學習網頁製作後，依序透過 Git 上傳至 GitHub 雲端儲存庫，再串接 Netlify 自動建置並取得公開分享網址。
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start md:self-auto"
            role="tablist"
            aria-label="選擇發佈步驟"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'github'}
              onClick={() => setActiveTab('github')}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'github'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="h-3.5 w-3.5" />
              2. 上傳到 GitHub
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'netlify'}
              onClick={() => setActiveTab('netlify')}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'netlify'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              3. 佈署到 Netlify
            </button>
          </div>
        </div>

        {activeTab === 'github' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Interactive Git Pipeline + Commands */}
            <div className="space-y-6 lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Git 推送流程模擬器
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={advanceGitStage}
                      disabled={gitStage >= 3}
                      className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {gitStage >= 3 ? '已推送至 GitHub' : '模擬下一步'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGitStage(0)}
                      aria-label="重設 Git 流程"
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      重設
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {GIT_STAGE_LABELS.map((label, idx) => {
                    const reached = idx <= gitStage;
                    return (
                      <div
                        key={label}
                        className={`rounded-lg border p-3 transition-colors ${
                          reached
                            ? 'border-emerald-500 bg-emerald-50/70'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                            0{idx + 1}
                          </span>
                          {reached && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <p className="mt-2 text-xs font-semibold leading-snug text-slate-900">
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Copyable Terminal Block */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    終端機上傳指令清單
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('all-git', allGitBlock)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedId === 'all-git' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        已複製全部
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        複製全部指令
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {gitCommands.map((item) => {
                    const isHighlighted = item.stageTarget === gitStage;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 transition-colors ${
                          isHighlighted
                            ? 'border-sky-500 bg-sky-50/60'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-slate-600">{item.label}</div>
                          <code className="mt-0.5 block truncate font-mono text-xs sm:text-sm font-semibold text-slate-900">
                            {item.cmd}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.cmd)}
                          aria-label={`複製 ${item.label}`}
                          className="shrink-0 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                        >
                          {copiedId === item.id ? '✓ 已複製' : '複製'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Repo Configurator */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">
                  自訂你的 GitHub 儲存庫資訊
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  輸入你的 GitHub 帳號與專案名稱，左側終端機指令將即時自動替換為專屬連結。
                </p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="gh-user"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      GitHub 使用者名稱（Username）
                    </label>
                    <input
                      id="gh-user"
                      type="text"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gh-repo"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      儲存庫名稱（Repository Name）
                    </label>
                    <input
                      id="gh-repo"
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <span className="block text-xs font-semibold text-slate-700">
                      目標遠端儲存庫網址
                    </span>
                    <div className="mt-1.5 break-all font-mono text-xs text-sky-700">
                      {repoUrl}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600">
                    <p className="font-semibold text-slate-900">課堂小提醒</p>
                    <p className="mt-1">
                      請確認專案根目錄的 <code className="font-mono text-slate-800">.gitignore</code> 已排除{' '}
                      <code className="font-mono text-slate-800">node_modules/</code> 與{' '}
                      <code className="font-mono text-slate-800">.env</code>，避免上傳龐大套件或機密金鑰。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Netlify CI/CD Pipeline + netlify.toml */}
            <div className="space-y-6 lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Netlify 自動建置佈署模擬
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={advanceNetlifyStage}
                      disabled={netlifyStage >= 2}
                      className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {netlifyStage >= 2 ? '網站已上線' : '模擬建置下一步'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNetlifyStage(0)}
                      aria-label="重設 Netlify 流程"
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      重設
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {NETLIFY_STAGE_LABELS.map((label, idx) => {
                    const reached = idx <= netlifyStage;
                    return (
                      <div
                        key={label}
                        className={`rounded-lg border p-3.5 transition-colors ${
                          reached
                            ? 'border-emerald-500 bg-emerald-50/70'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                            階段 0{idx + 1}
                          </span>
                          {reached && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-900">{label}</p>
                      </div>
                    );
                  })}
                </div>

                {netlifyStage >= 2 && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-3">
                    <div>
                      <span className="text-xs font-semibold text-emerald-700">
                        ● 預估發佈網址已就緒
                      </span>
                      <div className="font-mono text-sm font-semibold text-slate-900">
                        {netlifyUrl}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                      <ExternalLink className="h-3.5 w-3.5" />
                      HTTPS 自動憑證
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      設定檔：netlify.toml（建議放置於專案根目錄）
                    </h3>
                    <p className="text-xs text-slate-500">
                      確保打包指令與單頁式應用（SPA）路由重導設定正確
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('netlify-toml', netlifyToml)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedId === 'netlify-toml' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        已複製
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        複製 netlify.toml
                      </>
                    )}
                  </button>
                </div>

                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs sm:text-sm leading-6 text-slate-100">
                  {netlifyToml}
                </pre>
              </div>
            </div>

            {/* Right: Netlify Dashboard Settings Reference */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">
                  Netlify 控制台欄位填寫對照
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  登入 Netlify 後點選「Add new site」→「Import an existing project」並選擇你的 GitHub 儲存庫。
                </p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-3.5">
                    <span className="block text-xs text-slate-500">Repository（專案來源）</span>
                    <span className="mt-1 block font-mono text-sm font-semibold text-slate-900">
                      {safeUser}/{safeRepo}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3.5">
                    <span className="block text-xs text-slate-500">Branch to deploy（佈署分支）</span>
                    <span className="mt-1 block font-mono text-sm font-semibold text-slate-900">
                      main
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3.5">
                    <span className="block text-xs text-slate-500">Build command（建置指令）</span>
                    <span className="mt-1 block font-mono text-sm font-semibold text-sky-700">
                      npm run build
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3.5">
                    <span className="block text-xs text-slate-500">Publish directory（發佈資料夾）</span>
                    <span className="mt-1 block font-mono text-sm font-semibold text-sky-700">
                      dist
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
