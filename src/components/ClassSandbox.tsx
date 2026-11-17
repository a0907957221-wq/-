import {useState} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {CLASS_BLUEPRINTS, LIFECYCLE_STEPS} from '../data/curriculum';
import {
  BlueprintId,
  ObjectInstance,
  ReplEntry,
} from '../types/learning';
import {ObjectVisualSvg} from './ObjectVisualSvg';

interface ClassSandboxProps {
  onCompleteInteraction: () => void;
}

function makeMemoryAddress(seed: number): string {
  const hex = (0x7f1a00 + ((seed * 4919) % 0xfff)).toString(16);
  return `0x${hex}`;
}

function getVarPrefix(id: BlueprintId): string {
  if (id === BlueprintId.ForestSpirit) return 's';
  if (id === BlueprintId.DeskLamp) return 'lamp';
  return 'book';
}

export function ClassSandbox({onCompleteInteraction}: ClassSandboxProps) {
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintId>(BlueprintId.ForestSpirit);
  const blueprint = CLASS_BLUEPRINTS[selectedBlueprint];

  const [nameInput, setNameInput] = useState<string>(blueprint.defaultNames[0]);
  const [metricInput, setMetricInput] = useState<number>(blueprint.primaryMetricDefault);
  const [optionInput, setOptionInput] = useState<string>(blueprint.secondaryOptions[0]);

  const [lifecycleIndex, setLifecycleIndex] = useState<number>(0);
  const [selectedLineNumber, setSelectedLineNumber] = useState<number>(1);

  const [instances, setInstances] = useState<ObjectInstance[]>([
    {
      uid: 'init-1',
      memoryAddress: '0x7f1a4c',
      varName: 's1',
      blueprintId: BlueprintId.ForestSpirit,
      name: '小綠',
      metricValue: 80,
      optionValue: '森林系',
      isActive: true,
      actionCount: 0,
      lastOutput: '物件已透過 __init__ 初始化完成',
    },
  ]);

  const [counter, setCounter] = useState<number>(2);
  const [replLogs, setReplLogs] = useState<ReplEntry[]>([
    {
      id: 'repl-0',
      command: 's1 = ForestSpirit("小綠", "森林系", 80)',
      output: '<ForestSpirit object at 0x7f1a4c> · 已配置獨立屬性空間',
    },
  ]);

  const handleSelectBlueprint = (id: BlueprintId) => {
    const nextBp = CLASS_BLUEPRINTS[id];
    setSelectedBlueprint(id);
    setNameInput(nextBp.defaultNames[0]);
    setMetricInput(nextBp.primaryMetricDefault);
    setOptionInput(nextBp.secondaryOptions[0]);
    setSelectedLineNumber(1);
    setLifecycleIndex(0);
  };

  const activeStep = LIFECYCLE_STEPS[lifecycleIndex];
  const inspectedLine =
    blueprint.codeLines.find((line) => line.lineNumber === selectedLineNumber) ??
    blueprint.codeLines[0];

  const handleInstantiate = () => {
    onCompleteInteraction();
    if (instances.length >= 4) {
      setReplLogs((prev) => [
        {
          id: `err-${Date.now()}`,
          command: `${getVarPrefix(selectedBlueprint)}${counter} = ${blueprint.className}(...)`,
          output: '記憶區示範上限為 4 個物件，請先移除一個舊物件後再建立。',
          isError: true,
        },
        ...prev.slice(0, 7),
      ]);
      return;
    }

    const cleanName = nameInput.trim() || blueprint.defaultNames[counter % blueprint.defaultNames.length];
    const varName = `${getVarPrefix(selectedBlueprint)}${counter}`;
    const memoryAddress = makeMemoryAddress(counter + instances.length * 7);

    const newObj: ObjectInstance = {
      uid: `obj-${Date.now()}-${counter}`,
      memoryAddress,
      varName,
      blueprintId: selectedBlueprint,
      name: cleanName,
      metricValue: metricInput,
      optionValue: optionInput,
      isActive: true,
      actionCount: 0,
      lastOutput: `已呼叫 ${blueprint.className}.__init__()`,
    };

    const cmd = `${varName} = ${blueprint.className}("${cleanName}", "${optionInput}", ${metricInput})`;
    const out = `<${blueprint.className} object at ${memoryAddress}>`;

    setInstances((prev) => [...prev, newObj]);
    setCounter((c) => c + 1);
    setLifecycleIndex(2);
    setSelectedLineNumber(2);
    setNameInput(blueprint.defaultNames[counter % blueprint.defaultNames.length]);
    setReplLogs((prev) => [{id: `log-${Date.now()}`, command: cmd, output: out}, ...prev.slice(0, 7)]);
  };

  const handleInvokeMethod = (uid: string, actionType: 'primary' | 'secondary') => {
    onCompleteInteraction();
    setLifecycleIndex(3);

    setInstances((prev) =>
      prev.map((obj) => {
        if (obj.uid !== uid) return obj;

        let command = '';
        let output = '';
        let nextMetric = obj.metricValue;
        let nextActive = obj.isActive;

        if (obj.blueprintId === BlueprintId.ForestSpirit) {
          if (actionType === 'primary') {
            command = `${obj.varName}.cast_spell()`;
            if (obj.metricValue >= 20) {
              nextMetric = obj.metricValue - 20;
              output = `${obj.name} 施放${obj.optionValue}魔法！魔力值降至 ${nextMetric} MP`;
              nextActive = nextMetric > 0;
            } else {
              output = `${obj.name} 魔力不足（目前 ${obj.metricValue} MP），無法施法！`;
            }
          } else {
            command = `${obj.varName}.rest()`;
            nextMetric = Math.min(100, obj.metricValue + 25);
            nextActive = true;
            output = `${obj.name} 休息回復中，魔力值上升至 ${nextMetric} MP`;
          }
        } else if (obj.blueprintId === BlueprintId.DeskLamp) {
          if (actionType === 'primary') {
            command = `${obj.varName}.toggle()`;
            nextActive = !obj.isActive;
            output = `${obj.name} 電源切換為：${nextActive ? '開啟 (True)' : '關閉 (False)'}`;
          } else {
            command = `${obj.varName}.brighten(15)`;
            nextMetric = obj.metricValue >= 100 ? 25 : Math.min(100, obj.metricValue + 15);
            nextActive = true;
            output = `${obj.name} 調整亮度至 ${nextMetric}%`;
          }
        } else {
          if (actionType === 'primary') {
            command = `${obj.varName}.read_pages(15)`;
            nextMetric = Math.min(200, obj.metricValue + 15);
            output = `閱讀《${obj.name}》，目前進度推進至第 ${nextMetric} 頁`;
          } else {
            command = `${obj.varName}.reset_bookmark()`;
            nextMetric = 1;
            output = `已將《${obj.name}》書籤重設回第 1 頁`;
          }
        }

        setReplLogs((logs) => [
          {id: `act-${Date.now()}`, command, output},
          ...logs.slice(0, 7),
        ]);

        return {
          ...obj,
          metricValue: nextMetric,
          isActive: nextActive,
          actionCount: obj.actionCount + 1,
          lastOutput: output,
        };
      })
    );
  };

  const handleDeleteInstance = (uid: string) => {
    const target = instances.find((o) => o.uid === uid);
    setInstances((prev) => prev.filter((o) => o.uid !== uid));
    if (target) {
      setReplLogs((logs) => [
        {
          id: `del-${Date.now()}`,
          command: `del ${target.varName}`,
          output: `已釋放 ${target.memoryAddress} 上的 ${target.name} 物件參考`,
        },
        ...logs.slice(0, 7),
      ]);
    }
  };

  const handleResetAll = () => {
    setInstances([]);
    setCounter(1);
    setLifecycleIndex(0);
    setSelectedLineNumber(1);
    setReplLogs([
      {
        id: `reset-${Date.now()}`,
        command: '# 記憶體空間已清空',
        output: '請在右側控制面板設定參數並建立新的 Python 物件實例。',
      },
    ]);
  };

  const getMethodLabels = (bpId: BlueprintId) => {
    if (bpId === BlueprintId.ForestSpirit) {
      return {primary: 'cast_spell()', secondary: 'rest()'};
    }
    if (bpId === BlueprintId.DeskLamp) {
      return {primary: 'toggle()', secondary: 'brighten()'};
    }
    return {primary: 'read_pages(15)', secondary: 'reset_bookmark()'};
  };

  return (
    <section id="class-sandbox" className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-sky-700">01. 互動實驗室</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              類別藍圖與物件實例沙盒
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              選擇一個 Python 類別模板，點擊程式碼了解語法結構，接著在右側建立多個實例物件，觀察它們如何在記憶體中各自保存狀態。
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start md:self-auto"
            role="tablist"
            aria-label="選擇類別模板"
          >
            {(Object.keys(CLASS_BLUEPRINTS) as BlueprintId[]).map((id) => {
              const bp = CLASS_BLUEPRINTS[id];
              const active = selectedBlueprint === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectBlueprint(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {bp.className} · {bp.zhName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Stage: Blueprint Code + Live Memory Heap + Execution Console (65%) */}
          <div className="space-y-6 lg:col-span-8">
            {/* Interactive Code Blueprint */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-900">
                    {blueprint.className}.py
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>點擊任一行程式碼檢視語法解析</span>
                </div>
                <span className="text-xs font-medium text-sky-700">
                  目前聚焦：{activeStep.title}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs sm:text-sm leading-6 text-slate-100">
                {blueprint.codeLines.map((line) => {
                  const isLineSelected = line.lineNumber === selectedLineNumber;
                  const isPartHighlighted = line.part === activeStep.highlightPart;
                  return (
                    <button
                      key={line.lineNumber}
                      type="button"
                      onClick={() => setSelectedLineNumber(line.lineNumber)}
                      className={`flex w-full items-center rounded px-2 py-0.5 text-left transition-colors cursor-pointer ${
                        isLineSelected
                          ? 'bg-sky-500/25 text-white ring-1 ring-sky-400/60'
                          : isPartHighlighted
                            ? 'bg-emerald-500/15 text-emerald-100'
                            : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <span className="mr-4 w-5 shrink-0 select-none text-right text-slate-500 tabular-nums">
                        {line.lineNumber}
                      </span>
                      <span className="whitespace-pre">{line.code}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <span className="font-mono text-sky-700">第 {inspectedLine.lineNumber} 行</span>
                  <span aria-hidden="true">·</span>
                  <span>{inspectedLine.noteTitle}</span>
                </div>
                <p className="text-sm text-slate-600">{inspectedLine.noteDetail}</p>
              </div>
            </div>

            {/* Live Memory Heap Stage */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    記憶體實例空間（Object Heap）
                  </h3>
                  <p className="text-xs text-slate-500">
                    每個物件都有獨立記憶體位址與專屬屬性，呼叫方法只會影響該實例本身
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-slate-600 tabular-nums">
                  已建立實例：{instances.length} / 4
                </span>
              </div>

              {instances.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-medium text-slate-700">目前記憶體中沒有任何物件實例</p>
                  <p className="mt-1 text-xs text-slate-500">
                    請點擊右側的「建立物件實例」按鈕，從類別藍圖產生新物件。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {instances.map((obj) => {
                    const bp = CLASS_BLUEPRINTS[obj.blueprintId];
                    const labels = getMethodLabels(obj.blueprintId);
                    const stateText =
                      obj.blueprintId === BlueprintId.DeskLamp
                        ? obj.isActive
                          ? '● 電源開啟'
                          : '○ 電源關閉'
                        : obj.blueprintId === BlueprintId.ForestSpirit
                          ? obj.metricValue >= 20
                            ? '● 魔力充沛'
                            : '▲ 魔力偏低'
                          : '● 閱讀中';

                    const stateClass =
                      obj.blueprintId === BlueprintId.ForestSpirit && obj.metricValue < 20
                        ? 'text-amber-700'
                        : obj.isActive
                          ? 'text-emerald-700'
                          : 'text-slate-500';

                    return (
                      <div
                        key={obj.uid}
                        className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-semibold text-sky-700">
                                  {obj.varName}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">
                                  ·
                                </span>
                                <span className="font-mono text-xs text-slate-500 tabular-nums">
                                  {obj.memoryAddress}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {bp.className} 實例 ·{' '}
                                <span className={`font-medium ${stateClass}`}>{stateText}</span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteInstance(obj.uid)}
                              aria-label={`刪除物件 ${obj.varName}`}
                              className="rounded p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center gap-4">
                            <ObjectVisualSvg instance={obj} />
                            <div className="min-w-0 flex-1 space-y-1.5 text-xs">
                              <div className="flex justify-between gap-2">
                                <span className="font-mono text-slate-500">self.name</span>
                                <span className="truncate font-semibold text-slate-900">
                                  "{obj.name}"
                                </span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="font-mono text-slate-500">特性</span>
                                <span className="font-medium text-slate-800">{obj.optionValue}</span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="font-mono text-slate-500">數值</span>
                                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                                  {obj.metricValue} {bp.primaryMetricUnit}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-slate-200/80 pt-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleInvokeMethod(obj.uid, 'primary')}
                              className="flex-1 rounded-md bg-sky-600 px-3 py-1.5 font-mono text-xs font-medium text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              {obj.varName}.{labels.primary}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInvokeMethod(obj.uid, 'secondary')}
                              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              {obj.varName}.{labels.secondary}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Execution Console */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Python 執行紀錄（REPL Console）
              </h3>
              <div className="max-h-44 space-y-2 overflow-y-auto rounded-lg bg-slate-900 p-4 font-mono text-xs">
                {replLogs.map((entry) => (
                  <div key={entry.id} className="space-y-0.5 border-b border-slate-800 pb-2 last:border-b-0 last:pb-0">
                    <div className="text-sky-300">
                      <span className="mr-2 text-slate-500">&gt;&gt;&gt;</span>
                      {entry.command}
                    </div>
                    <div className={entry.isError ? 'text-rose-400' : 'text-emerald-300'}>
                      {entry.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Control & Concept Deck (35%) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Object Instantiation Controls */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">建立物件實例</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{blueprint.summary}</p>

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="instance-name"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    物件名稱（傳入 __init__）
                  </label>
                  <input
                    id="instance-name"
                    type="text"
                    value={nameInput}
                    maxLength={16}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={blueprint.defaultNames[0]}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700">
                    {blueprint.secondaryOptionLabel}
                  </span>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {blueprint.secondaryOptions.map((opt) => {
                      const active = optionInput === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setOptionInput(opt)}
                          className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'border-sky-600 bg-sky-50 text-sky-800'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="metric-slider" className="font-semibold text-slate-700">
                      {blueprint.primaryMetricLabel}
                    </label>
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      {metricInput} {blueprint.primaryMetricUnit}
                    </span>
                  </div>
                  <input
                    id="metric-slider"
                    type="range"
                    min={blueprint.primaryMetricMin}
                    max={blueprint.primaryMetricMax}
                    value={metricInput}
                    onChange={(e) => setMetricInput(Number(e.target.value))}
                    className="mt-2 w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
                    <span>
                      {blueprint.primaryMetricMin} {blueprint.primaryMetricUnit}
                    </span>
                    <span>
                      {blueprint.primaryMetricMax} {blueprint.primaryMetricUnit}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-200">
                  <span className="text-slate-400"># 即將執行的建構式：</span>
                  <div className="mt-1 break-all text-sky-300">
                    {getVarPrefix(selectedBlueprint)}
                    {counter} = {blueprint.className}("{nameInput.trim() || blueprint.defaultNames[0]}", "{optionInput}", {metricInput})
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleInstantiate}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    建立物件實例
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    aria-label="清空記憶體物件"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    重設
                  </button>
                </div>
              </div>
            </div>

            {/* Step-by-step Lifecycle Walkthrough */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">物件生命週期導覽</h3>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {lifecycleIndex + 1} / {LIFECYCLE_STEPS.length}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {LIFECYCLE_STEPS.map((item, idx) => {
                  const isCurrent = idx === lifecycleIndex;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => {
                        setLifecycleIndex(idx);
                        const matchLine = blueprint.codeLines.find(
                          (l) => l.part === item.highlightPart
                        );
                        if (matchLine) setSelectedLineNumber(matchLine.lineNumber);
                      }}
                      className={`w-full rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/70'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          <span className="mr-1.5 font-mono text-emerald-700 tabular-nums">
                            0{item.step}.
                          </span>
                          {item.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-medium text-emerald-700 whitespace-nowrap">
                            ● 檢視中
                          </span>
                        )}
                      </div>
                      {isCurrent && (
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={lifecycleIndex === 0}
                  onClick={() => setLifecycleIndex((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  上一步
                </button>
                <button
                  type="button"
                  disabled={lifecycleIndex === LIFECYCLE_STEPS.length - 1}
                  onClick={() =>
                    setLifecycleIndex((i) => Math.min(LIFECYCLE_STEPS.length - 1, i + 1))
                  }
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                >
                  下一步
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
