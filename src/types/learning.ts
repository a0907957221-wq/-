export enum BlueprintId {
  ForestSpirit = 'forest_spirit',
  DeskLamp = 'desk_lamp',
  MagicBook = 'magic_book',
}

export enum CodePartKind {
  ClassKeyword = 'class_keyword',
  InitMethod = 'init_method',
  SelfParam = 'self_param',
  InstanceAttr = 'instance_attr',
  ClassMethod = 'class_method',
}

export interface CodeLine {
  lineNumber: number;
  code: string;
  part: CodePartKind;
  noteTitle: string;
  noteDetail: string;
}

export interface ClassBlueprint {
  id: BlueprintId;
  className: string;
  zhName: string;
  summary: string;
  defaultNames: string[];
  primaryMetricLabel: string;
  primaryMetricUnit: string;
  primaryMetricMin: number;
  primaryMetricMax: number;
  primaryMetricDefault: number;
  secondaryOptionLabel: string;
  secondaryOptions: string[];
  codeLines: CodeLine[];
}

export interface ObjectInstance {
  uid: string;
  memoryAddress: string;
  varName: string;
  blueprintId: BlueprintId;
  name: string;
  metricValue: number;
  optionValue: string;
  isActive: boolean;
  actionCount: number;
  lastOutput: string;
}

export interface ReplEntry {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  prompt: string;
  codeSnippet: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
