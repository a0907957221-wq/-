import {useState} from 'react';
import {AlertTriangle, CheckCircle2, Lock, ShieldCheck} from 'lucide-react';

type PillarTab = 'inheritance' | 'encapsulation';

export function OopPillarsLab() {
  const [activeTab, setActiveTab] = useState<PillarTab>('inheritance');

  // Inheritance controls
  const [useSuperInit, setUseSuperInit] = useState<boolean>(true);
  const [overrideDescribe, setOverrideDescribe] = useState<boolean>(true);
  const [selectedChild, setSelectedChild] = useState<'MagicBook' | 'DeskLamp'>('MagicBook');

  // Encapsulation controls
  const [usePropertyGuard, setUsePropertyGuard] = useState<boolean>(true);
  const [attemptedEnergy, setAttemptedEnergy] = useState<number>(80);

  const isNegativeInvalid = attemptedEnergy < 0 || attemptedEnergy > 100;
  const blockedByGuard = usePropertyGuard && isNegativeInvalid;
  const finalEnergyValue = blockedByGuard ? 80 : attemptedEnergy;

  const inheritanceCode = `class StudyItem:
    def __init__(self, title):
        self.title = title

    def describe(self):
        return f"學習物品：{self.title}"

class ${selectedChild}(StudyItem):
    def __init__(self, title, detail):
${
  useSuperInit
    ? '        super().__init__(title)  # 沿用父類別初始化'
    : '        self.title = title       # 未用 super()，程式碼重複'
}
        self.detail = detail
${
  overrideDescribe
    ? `
    def describe(self):          # 方法覆寫（Overriding）
        return f"${selectedChild === 'MagicBook' ? '魔法筆記書' : '黃銅檯燈'}：《{self.title}》（{self.detail}）"`
    : ''
}

item = ${selectedChild}(${selectedChild === 'MagicBook' ? '"Python 入門", "第 42 頁"' : '"閱讀暖燈", "亮度 85%"'})
print(item.describe())`;

  const inheritanceOutput = overrideDescribe
    ? selectedChild === 'MagicBook'
      ? '魔法筆記書：《Python 入門》（第 42 頁）'
      : '黃銅檯燈：《閱讀暖燈》（亮度 85%）'
    : selectedChild === 'MagicBook'
      ? '學習物品：Python 入門'
      : '學習物品：閱讀暖燈';

  const encapsulationCode = `class ForestSpirit:
    def __init__(self, name):
        self.name = name
        self.__energy = 80       # 雙底線私有屬性（Private）

${
  usePropertyGuard
    ? `    @property
    def energy(self):
        return self.__energy

    @energy.setter
    def energy(self, value):
        if not 0 <= value <= 100:
            raise ValueError("魔力必須介於 0 到 100 之間")
        self.__energy = value`
    : `    # 未啟用 @property 驗證，外部可直接寫入任意值`
}

s1 = ForestSpirit("小綠")
${usePropertyGuard ? `s1.energy = ${attemptedEnergy}` : `s1._ForestSpirit__energy = ${attemptedEnergy}`}`;

  return (
    <section id="oop-pillars" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-sky-700">02. 進階核心概念</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              繼承、多型與封裝保護實驗
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              透過即時切換「繼承覆寫」與「私有屬性驗證」，觀察子類別如何重複利用程式碼，以及封裝如何避免物件陷入不合理狀態。
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start md:self-auto"
            role="tablist"
            aria-label="選擇物件導向進階主題"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'inheritance'}
              onClick={() => setActiveTab('inheritance')}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'inheritance'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              繼承與方法覆寫
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'encapsulation'}
              onClick={() => setActiveTab('encapsulation')}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'encapsulation'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              封裝與 @property 驗證
            </button>
          </div>
        </div>

        {activeTab === 'inheritance' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Visual Inheritance Diagram + Code */}
            <div className="space-y-6 lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  類別繼承架構圖（Inheritance Hierarchy）
                </h3>

                <div className="flex flex-col items-center">
                  {/* Parent Box */}
                  <div className="w-full max-w-xs rounded-lg border border-slate-300 bg-white p-3.5 text-center">
                    <span className="text-[11px] font-medium text-slate-500">父類別（Parent）</span>
                    <div className="mt-0.5 font-mono text-sm font-bold text-slate-900">
                      class StudyItem
                    </div>
                    <div className="mt-1 font-mono text-xs text-slate-600">
                      self.title · describe()
                    </div>
                  </div>

                  {/* Connector lines SVG */}
                  <svg viewBox="0 0 320 44" className="h-11 w-full max-w-md" aria-hidden="true">
                    <line x1="160" y1="0" x2="160" y2="20" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="80" y1="20" x2="240" y2="20" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="80" y1="20" x2="80" y2="44" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="240" y1="20" x2="240" y2="44" stroke="#94a3b8" strokeWidth="2" />
                    <polygon points="160,2 155,10 165,10" fill="#64748b" />
                  </svg>

                  {/* Child Boxes */}
                  <div className="grid w-full max-w-md grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedChild('MagicBook')}
                      className={`rounded-lg border p-3.5 text-center transition-colors cursor-pointer ${
                        selectedChild === 'MagicBook'
                          ? 'border-sky-600 bg-sky-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[11px] font-medium text-slate-500">子類別 A</span>
                      <div className="mt-0.5 font-mono text-sm font-bold text-slate-900">
                        MagicBook(StudyItem)
                      </div>
                      <div className="mt-1 text-xs text-sky-700">
                        {overrideDescribe ? '● 已覆寫 describe()' : '○ 沿用父類別方法'}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedChild('DeskLamp')}
                      className={`rounded-lg border p-3.5 text-center transition-colors cursor-pointer ${
                        selectedChild === 'DeskLamp'
                          ? 'border-sky-600 bg-sky-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[11px] font-medium text-slate-500">子類別 B</span>
                      <div className="mt-0.5 font-mono text-sm font-bold text-slate-900">
                        DeskLamp(StudyItem)
                      </div>
                      <div className="mt-1 text-xs text-sky-700">
                        {overrideDescribe ? '● 已覆寫 describe()' : '○ 沿用父類別方法'}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl bg-slate-900 p-5 font-mono text-xs sm:text-sm leading-6 text-slate-100">
                <pre className="whitespace-pre">{inheritanceCode}</pre>
              </div>
            </div>

            {/* Right Controls & Live Output */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">實驗參數調整</h3>
                <p className="mt-1 text-xs text-slate-600">
                  切換以下選項，即時觀察程式碼結構與執行輸出的差異。
                </p>

                <div className="mt-5 space-y-4">
                  <label className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3.5 cursor-pointer">
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">
                        使用 super().__init__()
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        讓子類別自動借用父類別的屬性初始化邏輯，減少重複程式碼。
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={useSuperInit}
                      onChange={(e) => setUseSuperInit(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-sky-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3.5 cursor-pointer">
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">
                        覆寫 describe() 方法（Override）
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        子類別重新定義同名方法，展現不同物件的多型（Polymorphism）行為。
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={overrideDescribe}
                      onChange={(e) => setOverrideDescribe(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-sky-600 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>執行輸出結果</span>
                    <span className="font-mono text-emerald-700 font-medium">
                      {overrideDescribe ? '● 執行子類別版本' : '● 繼承父類別版本'}
                    </span>
                  </div>
                  <div className="mt-2 rounded-md bg-slate-900 px-3.5 py-3 font-mono text-sm text-emerald-300">
                    {inheritanceOutput}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Encapsulation Code & Status */}
            <div className="space-y-6 lg:col-span-7">
              <div className="overflow-x-auto rounded-xl bg-slate-900 p-5 font-mono text-xs sm:text-sm leading-6 text-slate-100">
                <pre className="whitespace-pre">{encapsulationCode}</pre>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">系統狀態驗證結果</h3>
                  {blockedByGuard ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                      <AlertTriangle className="h-4 w-4" />
                      ▲ 觸發驗證攔截（ValueError）
                    </span>
                  ) : isNegativeInvalid ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      ▲ 警告：異常數值已寫入
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      ● 合法數值範圍
                    </span>
                  )}
                </div>

                <div className="mt-3 rounded-lg bg-slate-900 p-4 font-mono text-xs sm:text-sm">
                  {blockedByGuard ? (
                    <div className="space-y-1 text-rose-300">
                      <div>ValueError: 魔力必須介於 0 到 100 之間</div>
                      <div className="text-slate-400">
                        # 保護機制生效！self.__energy 維持原本的安全數值：{finalEnergyValue} MP
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-emerald-300">
                      <div>s1.energy 目前數值為：{finalEnergyValue} MP</div>
                      {isNegativeInvalid && (
                        <div className="text-amber-300">
                          # 因為未啟用 @property 檢查，負數或超過 100 的錯誤資料污染了物件狀態！
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Controls for Encapsulation */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-sky-700" />
                  <h3 className="text-base font-semibold text-slate-900">模擬寫入屬性測試</h3>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  試著將精靈魔力設定為負數或超過 100，比較有無封裝驗證的差別。
                </p>

                <div className="mt-5 space-y-5">
                  <label className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3.5 cursor-pointer">
                    <div>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        啟用 @property 資料驗證
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        透過 Setter 方法把關輸入值，拒絕不合法的負數或溢出數值。
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={usePropertyGuard}
                      onChange={(e) => setUsePropertyGuard(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-sky-600 cursor-pointer"
                    />
                  </label>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="encap-slider" className="font-semibold text-slate-700">
                        嘗試設定魔力值 (value)
                      </label>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {attemptedEnergy} MP
                      </span>
                    </div>
                    <input
                      id="encap-slider"
                      type="range"
                      min={-50}
                      max={150}
                      step={10}
                      value={attemptedEnergy}
                      onChange={(e) => setAttemptedEnergy(Number(e.target.value))}
                      className="mt-2 w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-500 tabular-nums">
                      <span>-50 MP（不合法）</span>
                      <span>0 – 100 MP（合法）</span>
                      <span>150 MP（不合法）</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setAttemptedEnergy(-30)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      測試 -30
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttemptedEnergy(75)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      測試 75
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttemptedEnergy(140)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      測試 140
                    </button>
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
