import {useState} from 'react';
import {ClassSandbox} from './components/ClassSandbox';
import {CourseHero} from './components/CourseHero';
import {DeployWorkflow} from './components/DeployWorkflow';
import {Header} from './components/Header';
import {OopPillarsLab} from './components/OopPillarsLab';
import {QuizChallenge} from './components/QuizChallenge';

export default function App() {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const handleToggleStep = (step: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const markStepDone = (step: number) => {
    setCompletedSteps((prev) => (prev[step] ? prev : {...prev, [step]: true}));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1">
        <CourseHero completedSteps={completedSteps} onToggleStep={handleToggleStep} />
        <ClassSandbox onCompleteInteraction={() => markStepDone(1)} />
        <OopPillarsLab />
        <QuizChallenge />
        <DeployWorkflow
          onCompleteGitHub={() => markStepDone(2)}
          onCompleteNetlify={() => markStepDone(3)}
        />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>Python 物件工坊 · AI 融入課程實作學習網頁</span>
          <div className="flex items-center gap-4">
            <a href="#overview" className="hover:text-slate-900 transition-colors">
              回到頂部
            </a>
            <span aria-hidden="true">·</span>
            <a href="#class-sandbox" className="hover:text-slate-900 transition-colors">
              物件沙盒
            </a>
            <span aria-hidden="true">·</span>
            <a href="#deploy-guide" className="hover:text-slate-900 transition-colors">
              佈署指南
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
