import {useState} from 'react';
import {CheckCircle2, RotateCcw, XCircle} from 'lucide-react';
import {QUIZ_QUESTIONS} from '../data/curriculum';

export function QuizChallenge() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const chosenOption = selectedAnswers[currentQuestion.id];
  const hasAnswered = chosenOption !== undefined;
  const isCorrect = chosenOption === currentQuestion.correctIndex;

  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  const handleSelectOption = (optionIdx: number) => {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowSummary(false);
  };

  return (
    <section id="quiz" className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-sky-700">03. 觀念檢核</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              隨堂實作挑戰
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              完成 5 道 Python 類別與物件核心題目，立即確認學習成效。
            </p>
          </div>
          <div className="font-mono text-xs font-medium text-slate-600 tabular-nums">
            目前題號：{currentIdx + 1} / {QUIZ_QUESTIONS.length} · 已答對 {correctCount} 題
          </div>
        </div>

        {showSummary ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="max-w-xl">
              <p className="font-mono text-xs font-semibold text-emerald-700">● 測驗完成</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 tabular-nums">
                你答對了 {correctCount} / {QUIZ_QUESTIONS.length} 題
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {correctCount === QUIZ_QUESTIONS.length
                  ? '太棒了！你已完整掌握類別藍圖、建構子 __init__、self 綁定與繼承 super() 的關鍵用法，可以繼續完成 GitHub 與 Netlify 佈署流程。'
                  : '你已完成所有隨堂題目。建議回顧上方互動沙盒重新操作一次錯誤觀念，或再次挑戰取得滿分。'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  重新測驗
                </button>
                <a
                  href="#deploy-guide"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('deploy-guide')?.scrollIntoView({behavior: 'smooth'});
                  }}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  前往步驟二與步驟三：GitHub 與 Netlify
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Code & Question Stem */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span>題目主題：{currentQuestion.topic}</span>
                <span className="font-mono tabular-nums">
                  第 {currentIdx + 1} 題
                </span>
              </div>
              <h3 className="text-base font-semibold leading-relaxed text-slate-900">
                {currentQuestion.prompt}
              </h3>

              <pre className="mt-5 overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs sm:text-sm leading-6 text-slate-100">
                {currentQuestion.codeSnippet}
              </pre>
            </div>

            {/* Answer Options & Instant Feedback */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = chosenOption === idx;
                  const isAnswer = currentQuestion.correctIndex === idx;

                  let buttonStyle =
                    'border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50/40';
                  if (hasAnswered) {
                    if (isAnswer) {
                      buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                    } else if (isSelected && !isAnswer) {
                      buttonStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      buttonStyle = 'border-slate-200 bg-slate-50 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`flex w-full items-start justify-between gap-3 rounded-lg border p-3.5 text-left text-sm transition-colors ${buttonStyle} ${
                        hasAnswered ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <span className="leading-snug">
                        <span className="mr-2 font-mono text-xs font-semibold text-slate-500">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </span>
                      {hasAnswered && isAnswer && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      )}
                      {hasAnswered && isSelected && !isAnswer && (
                        <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {isCorrect ? (
                      <span className="text-emerald-700">✓ 回答正確</span>
                    ) : (
                      <span className="text-rose-700">✕ 觀念解析</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex gap-1.5">
                  {QUIZ_QUESTIONS.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      aria-label={`跳至第 ${idx + 1} 題`}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-2.5 w-6 rounded-sm transition-colors cursor-pointer ${
                        idx === currentIdx
                          ? 'bg-sky-600'
                          : selectedAnswers[q.id] !== undefined
                            ? selectedAnswers[q.id] === q.correctIndex
                              ? 'bg-emerald-500'
                              : 'bg-rose-400'
                            : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!hasAnswered}
                  onClick={handleNext}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  {currentIdx < QUIZ_QUESTIONS.length - 1 ? '下一題' : '查看總結'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
