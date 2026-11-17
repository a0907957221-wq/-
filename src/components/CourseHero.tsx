import {useState} from 'react';
import {ArrowRight, BookOpen, CheckCircle2, Circle} from 'lucide-react';

interface CourseHeroProps {
  completedSteps: Record<number, boolean>;
  onToggleStep: (step: number) => void;
}

const COURSE_ROADMAP = [
  {
    step: 1,
    title: '建立 Python 類別與物件學習網頁',
    targetId: 'class-sandbox',
    summary: '透過互動藍圖與記憶體實例沙盒，掌握 class、__init__ 與 self 的核心原理。',
  },
  {
    step: 2,
    title: '上傳到 GitHub',
    targetId: 'deploy-guide',
    summary: '使用 Git 版控流程初始化專案，將程式碼安全推送至遠端儲存庫。',
  },
  {
    step: 3,
    title: '佈署到 Netlify',
    targetId: 'deploy-guide',
    summary: '連結 GitHub 儲存庫並設定 Vite 打包參數，自動發佈為公開學習網站。',
  },
];

export function CourseHero({completedSteps, onToggleStep}: CourseHeroProps) {
  const [posterError, setPosterError] = useState(false);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <section id="overview" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span>AI 融入課程</span>
                <span aria-hidden="true">·</span>
                <span>物件導向程式設計</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">學習進度 {completedCount} / 3 階段</span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.18]">
                從藍圖到上線：Python 類別與物件互動學習
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                依據課程實作路徑打造，將抽象的「類別（Class）」與「物件（Object）」轉化為可即時建立、修改與追蹤記憶體狀態的視覺化沙盒，並接軌 GitHub 版本控制與 Netlify 雲端佈署。
              </p>

              <div className="mt-8 space-y-3">
                {COURSE_ROADMAP.map((item) => {
                  const isDone = Boolean(completedSteps[item.step]);
                  return (
                    <div
                      key={item.step}
                      className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-slate-300"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => onToggleStep(item.step)}
                          aria-label={`標記步驟 ${item.step} 為${isDone ? '未完成' : '已完成'}`}
                          className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-400" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums">
                              0{item.step}.
                            </span>
                            <h2 className="text-sm font-semibold text-slate-900">{item.title}</h2>
                          </div>
                          <p className="mt-1 text-sm leading-snug text-slate-600">{item.summary}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => jumpTo(item.targetId)}
                        className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-sky-300 hover:text-sky-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        前往練習
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => jumpTo('class-sandbox')}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                進入類別與物件沙盒
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => jumpTo('deploy-guide')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                查看 GitHub 與 Netlify 佈署指南
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col">
              {!posterError ? (
                <img
                  src="/assets/aistudio/image_d223ead7.png"
                  alt="AI 融入課程主題海報：1. 建立 Python 類別與物件學習網頁、2. 上傳到 GitHub、3. 佈署到 Netlify"
                  referrerPolicy="no-referrer"
                  onError={() => setPosterError(true)}
                  className="w-full flex-1 rounded-lg object-cover object-center max-h-[470px]"
                />
              ) : (
                <div className="flex flex-1 min-h-[380px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-100 p-6 text-center">
                  <BookOpen className="h-10 w-10 text-sky-600 mb-3" />
                  <p className="text-base font-semibold text-slate-800">AI 融入課程實作海報</p>
                  <p className="mt-1 text-sm text-slate-500">
                    1. 建立 Python 類別與物件學習網頁 · 2. 上傳到 GitHub · 3. 佈署到 Netlify
                  </p>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between px-1 text-xs text-slate-500">
                <span>課程任務海報參考</span>
                <span>共 3 個實作階段</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
