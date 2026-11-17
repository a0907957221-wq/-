import {BlueprintId, ClassBlueprint, CodePartKind, QuizQuestion} from '../types/learning';

export const CLASS_BLUEPRINTS: Record<BlueprintId, ClassBlueprint> = {
  [BlueprintId.ForestSpirit]: {
    id: BlueprintId.ForestSpirit,
    className: 'ForestSpirit',
    zhName: '森林小精靈',
    summary: '以魔法能量與元素屬性為核心，展示如何透過類別建立多個獨立運作的精靈物件。',
    defaultNames: ['小綠', '葉子', '芽芽', '風鈴'],
    primaryMetricLabel: '初始魔力值 (energy)',
    primaryMetricUnit: 'MP',
    primaryMetricMin: 20,
    primaryMetricMax: 100,
    primaryMetricDefault: 80,
    secondaryOptionLabel: '精靈屬性 (element)',
    secondaryOptions: ['森林系', '水滴系', '星光系'],
    codeLines: [
      {
        lineNumber: 1,
        code: 'class ForestSpirit:',
        part: CodePartKind.ClassKeyword,
        noteTitle: '類別定義（Class Blueprint）',
        noteDetail: 'class 關鍵字用來建立物件的藍圖，類別名稱習慣使用大駝峰式命名（PascalCase）。',
      },
      {
        lineNumber: 2,
        code: '    def __init__(self, name, element, energy=80):',
        part: CodePartKind.InitMethod,
        noteTitle: '建構子方法（__init__）',
        noteDetail: '每次呼叫 ForestSpirit(...) 建立新物件時，Python 會自動執行 __init__ 來設定初始資料。',
      },
      {
        lineNumber: 3,
        code: '        self.name = name',
        part: CodePartKind.SelfParam,
        noteTitle: 'self 與實例屬性',
        noteDetail: 'self 代表「正在被建立的那一個物件本身」，將傳入的 name 專屬於該物件儲存。',
      },
      {
        lineNumber: 4,
        code: '        self.element = element',
        part: CodePartKind.InstanceAttr,
        noteTitle: '實例屬性（Instance Attribute）',
        noteDetail: '每個實例各自擁有獨立的屬性值，修改 s1.element 不會影響 s2.element。',
      },
      {
        lineNumber: 5,
        code: '        self.energy = energy',
        part: CodePartKind.InstanceAttr,
        noteTitle: '數值狀態屬性',
        noteDetail: '用來記錄此精靈當前的魔力值，後續可透過物件方法動態改變。',
      },
      {
        lineNumber: 6,
        code: '    def cast_spell(self):',
        part: CodePartKind.ClassMethod,
        noteTitle: '實例方法（Instance Method）',
        noteDetail: '定義物件能執行的行為。呼叫 s1.cast_spell() 時，Python 會自動把 s1 傳給 self。',
      },
      {
        lineNumber: 7,
        code: '        if self.energy >= 20:',
        part: CodePartKind.ClassMethod,
        noteTitle: '狀態檢查與條件邏輯',
        noteDetail: '方法內部透過 self.energy 讀取當前實例的狀態，決定是否能施放魔法。',
      },
      {
        lineNumber: 8,
        code: '            self.energy -= 20',
        part: CodePartKind.InstanceAttr,
        noteTitle: '更新實例內部狀態',
        noteDetail: '施法成功後扣除 20 點魔力，僅影響呼叫此方法的那個實例。',
      },
      {
        lineNumber: 9,
        code: '    def rest(self):',
        part: CodePartKind.ClassMethod,
        noteTitle: '回復狀態方法',
        noteDetail: '呼叫 rest() 可為當前精靈物件補充 25 點魔力（上限 100）。',
      },
    ],
  },
  [BlueprintId.DeskLamp]: {
    id: BlueprintId.DeskLamp,
    className: 'DeskLamp',
    zhName: '書桌檯燈',
    summary: '模擬書桌上的黃銅檯燈，透過布林開關與亮度屬性，直覺觀察物件狀態變化。',
    defaultNames: ['書桌主燈', '閱讀暖燈', '床頭小燈', '畫室立燈'],
    primaryMetricLabel: '燈光亮度 (brightness)',
    primaryMetricUnit: '%',
    primaryMetricMin: 10,
    primaryMetricMax: 100,
    primaryMetricDefault: 70,
    secondaryOptionLabel: '燈泡色溫 (tone)',
    secondaryOptions: ['暖黃光', '自然白', '琥珀光'],
    codeLines: [
      {
        lineNumber: 1,
        code: 'class DeskLamp:',
        part: CodePartKind.ClassKeyword,
        noteTitle: '類別定義（Class Blueprint）',
        noteDetail: '定義所有檯燈共同擁有的規格：名稱、色溫、亮度與開關狀態。',
      },
      {
        lineNumber: 2,
        code: '    def __init__(self, label, tone, brightness=70):',
        part: CodePartKind.InitMethod,
        noteTitle: '建構子初始化',
        noteDetail: '建立檯燈物件時自動設定初始亮度與色溫，並將電源預設為開啟。',
      },
      {
        lineNumber: 3,
        code: '        self.label = label',
        part: CodePartKind.SelfParam,
        noteTitle: 'self 綁定實例識別',
        noteDetail: '將傳入的標籤名稱綁定在當前檯燈物件上。',
      },
      {
        lineNumber: 4,
        code: '        self.tone = tone',
        part: CodePartKind.InstanceAttr,
        noteTitle: '燈光色溫屬性',
        noteDetail: '紀錄此檯燈的色溫類型，各個檯燈物件互不干擾。',
      },
      {
        lineNumber: 5,
        code: '        self.brightness = brightness',
        part: CodePartKind.InstanceAttr,
        noteTitle: '亮度百分比屬性',
        noteDetail: '控制畫面上檯燈的發光強度（10% 到 100%）。',
      },
      {
        lineNumber: 6,
        code: '        self.is_on = True',
        part: CodePartKind.InstanceAttr,
        noteTitle: '預設布林屬性',
        noteDetail: '無需從參數傳入，每個新建立的檯燈預設都是開啟狀態（True）。',
      },
      {
        lineNumber: 7,
        code: '    def toggle(self):',
        part: CodePartKind.ClassMethod,
        noteTitle: '切換電源方法',
        noteDetail: '反轉 self.is_on 的布林值，實現開燈與關燈功能。',
      },
      {
        lineNumber: 8,
        code: '        self.is_on = not self.is_on',
        part: CodePartKind.ClassMethod,
        noteTitle: '布林狀態切換',
        noteDetail: '將 True 變為 False，或將 False 變為 True。',
      },
      {
        lineNumber: 9,
        code: '    def brighten(self, step=15):',
        part: CodePartKind.ClassMethod,
        noteTitle: '調亮方法（帶預設參數）',
        noteDetail: '每次呼叫增加 15% 亮度，最高不超過 100%。',
      },
    ],
  },
  [BlueprintId.MagicBook]: {
    id: BlueprintId.MagicBook,
    className: 'MagicBook',
    zhName: '魔法筆記書',
    summary: '追蹤閱讀頁數與書籤分類的筆記書物件，理解物件如何在記憶體中保存進度。',
    defaultNames: ['Python 筆記', '演算法手札', '網頁開發誌', '植物圖鑑'],
    primaryMetricLabel: '目前頁數 (page)',
    primaryMetricUnit: '頁',
    primaryMetricMin: 1,
    primaryMetricMax: 200,
    primaryMetricDefault: 24,
    secondaryOptionLabel: '裝訂封面 (cover)',
    secondaryOptions: ['松木綠', '靛藍布', '赭紅皮'],
    codeLines: [
      {
        lineNumber: 1,
        code: 'class MagicBook:',
        part: CodePartKind.ClassKeyword,
        noteTitle: '類別定義（Class Blueprint）',
        noteDetail: '建立一本書的抽象模板，包含書名、封面、當前閱讀頁數與翻開狀態。',
      },
      {
        lineNumber: 2,
        code: '    def __init__(self, title, cover, page=1):',
        part: CodePartKind.InitMethod,
        noteTitle: '建構子（__init__）',
        noteDetail: '初始化書名、封面樣式與起始頁碼。',
      },
      {
        lineNumber: 3,
        code: '        self.title = title',
        part: CodePartKind.SelfParam,
        noteTitle: 'self 指向該本書',
        noteDetail: '讓每本書物件記住自己的書名。',
      },
      {
        lineNumber: 4,
        code: '        self.cover = cover',
        part: CodePartKind.InstanceAttr,
        noteTitle: '封面樣式屬性',
        noteDetail: '儲存該書籍實例的外觀屬性。',
      },
      {
        lineNumber: 5,
        code: '        self.page = page',
        part: CodePartKind.InstanceAttr,
        noteTitle: '閱讀進度屬性',
        noteDetail: '記錄目前讀到第幾頁，最多 200 頁。',
      },
      {
        lineNumber: 6,
        code: '    def read_pages(self, count=10):',
        part: CodePartKind.ClassMethod,
        noteTitle: '翻頁閱讀方法',
        noteDetail: '傳入要閱讀的頁數，更新 self.page 並回傳最新進度。',
      },
      {
        lineNumber: 7,
        code: '        self.page = min(200, self.page + count)',
        part: CodePartKind.InstanceAttr,
        noteTitle: '安全邊界更新',
        noteDetail: '使用 min() 確保頁數不會超過總頁數 200 頁。',
      },
      {
        lineNumber: 8,
        code: '    def reset_bookmark(self):',
        part: CodePartKind.ClassMethod,
        noteTitle: '重設書籤方法',
        noteDetail: '將該本書的閱讀頁數重新歸回第 1 頁。',
      },
    ],
  },
};

export const LIFECYCLE_STEPS = [
  {
    step: 1,
    title: '定義類別藍圖',
    description: '使用 class 關鍵字撰寫模板。此時記憶體中只有「設計圖」，還沒有任何實體物件。',
    highlightPart: CodePartKind.ClassKeyword,
  },
  {
    step: 2,
    title: '呼叫建構子 __init__',
    description: '寫下 ClassName(...) 時，Python 會配置一塊新記憶體，並自動執行 __init__。',
    highlightPart: CodePartKind.InitMethod,
  },
  {
    step: 3,
    title: '透過 self 綁定屬性',
    description: 'self 指向剛配置好的記憶體位址，把傳入的資料寫入這個獨立物件中。',
    highlightPart: CodePartKind.SelfParam,
  },
  {
    step: 4,
    title: '呼叫實例方法互動',
    description: '利用「物件.方法()」操作特定實例的內部屬性，其他實例完全不受影響。',
    highlightPart: CodePartKind.ClassMethod,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: '類別與實例',
    prompt: '在 Python 中，關於「類別（Class）」與「物件（Object / Instance）」的關係，下列哪一項描述最正確？',
    codeSnippet: `class ForestSpirit:
    pass

s1 = ForestSpirit()
s2 = ForestSpirit()`,
    options: [
      '類別是建立物件的藍圖，s1 與 s2 是根據同一藍圖建立的兩個獨立物件',
      's1 與 s2 共用同一塊記憶體位址，修改 s1 一定會同時改變 s2',
      'class 定義好之後就會自動建立一個物件，不需要呼叫 ForestSpirit()',
      '一個類別只能建立一個物件，無法重複實例化',
    ],
    correctIndex: 0,
    explanation: '類別就像建築藍圖或餅乾模具，每次呼叫 ForestSpirit() 都會在記憶體中配置獨立的新物件，因此 s1 與 s2 彼此獨立。',
  },
  {
    id: 'q2',
    topic: '建構子 __init__',
    prompt: '當我們執行 lamp = DeskLamp("閱讀燈") 時，Python 會自動呼叫哪一個特殊方法來設定物件的初始屬性？',
    codeSnippet: `class DeskLamp:
    def ______(self, label):
        self.label = label`,
    options: ['__start__', '__init__', '__create__', '__self__'],
    correctIndex: 1,
    explanation: '__init__（前後各兩條底線）是 Python 的初始化方法（建構子），在建立物件實例時會自動被呼叫。',
  },
  {
    id: 'q3',
    topic: 'self 的意義',
    prompt: '在類別的方法定義 def cast_spell(self): 中，第一個參數 self 代表什麼？',
    codeSnippet: `s1 = ForestSpirit("小綠")
s1.cast_spell()`,
    options: [
      '代表 ForestSpirit 類別本身的名稱字串',
      '代表呼叫該方法的那個物件實例本身（此處為 s1）',
      '代表上一個被建立的物件',
      '是 Python 的全域變數，所有函式都必須寫',
    ],
    correctIndex: 1,
    explanation: '呼叫 s1.cast_spell() 時，Python 會在幕後自動轉譯成 ForestSpirit.cast_spell(s1)，因此 self 就是 s1 這個實例本身。',
  },
  {
    id: 'q4',
    topic: '屬性獨立性',
    prompt: '執行以下程式碼後，最後印出的結果為何？',
    codeSnippet: `class MagicBook:
    def __init__(self, page):
        self.page = page

b1 = MagicBook(10)
b2 = MagicBook(10)
b1.page += 15
print(b2.page)`,
    options: ['25', '15', '10', '程式會發生 NameError'],
    correctIndex: 2,
    explanation: 'self.page 是「實例屬性」，b1 與 b2 各有各的屬性空間。修改 b1.page 不會影響 b2.page，所以 b2.page 仍是 10。',
  },
  {
    id: 'q5',
    topic: '繼承與 super()',
    prompt: '子類別 MagicBook 繼承父類別 StudyItem 時，若要在子類別的 __init__ 中沿用父類別的初始化邏輯，應使用哪個語法？',
    codeSnippet: `class MagicBook(StudyItem):
    def __init__(self, title, pages):
        ______(title)
        self.pages = pages`,
    options: [
      'parent.__init__',
      'super().__init__',
      'base.init',
      'StudyItem.create',
    ],
    correctIndex: 1,
    explanation: 'super().__init__(...) 可以呼叫父類別的初始化方法，避免重複撰寫相同的屬性指派程式碼。',
  },
];
