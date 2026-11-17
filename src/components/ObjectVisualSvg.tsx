import {BlueprintId, ObjectInstance} from '../types/learning';

interface ObjectVisualSvgProps {
  instance: ObjectInstance;
}

export function ObjectVisualSvg({instance}: ObjectVisualSvgProps) {
  if (instance.blueprintId === BlueprintId.ForestSpirit) {
    const colorMap: Record<string, {fill: string; stroke: string; glow: string}> = {
      森林系: {fill: '#10b981', stroke: '#047857', glow: '#a7f3d0'},
      水滴系: {fill: '#0ea5e9', stroke: '#0369a1', glow: '#bae6fd'},
      星光系: {fill: '#f59e0b', stroke: '#b45309', glow: '#fde68a'},
    };
    const palette = colorMap[instance.optionValue] ?? colorMap['森林系'];
    const auraOpacity = Math.max(0.15, instance.metricValue / 100);

    return (
      <svg viewBox="0 0 88 88" className="h-20 w-20 shrink-0" aria-hidden="true">
        <circle cx="44" cy="46" r="34" fill={palette.glow} opacity={auraOpacity} />
        <path
          d="M44 16 C36 22, 34 28, 32 34 C24 38, 22 50, 26 60 C30 68, 58 68, 62 60 C66 50, 64 38, 56 34 C54 28, 52 22, 44 16 Z"
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth="2.5"
        />
        <path
          d="M36 24 L31 12 L41 21 M52 24 L57 12 L47 21"
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="37" cy="44" r="3" fill="#0f172a" />
        <circle cx="51" cy="44" r="3" fill="#0f172a" />
        <path d="M40 50 Q44 54 48 50" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 58 L40 55 L44 58 L48 55 L52 58" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (instance.blueprintId === BlueprintId.DeskLamp) {
    const toneMap: Record<string, string> = {
      暖黃光: '#fde047',
      自然白: '#e0f2fe',
      琥珀光: '#fdba74',
    };
    const beamColor = toneMap[instance.optionValue] ?? '#fde047';
    const beamOpacity = instance.isActive ? Math.max(0.2, instance.metricValue / 100) : 0;

    return (
      <svg viewBox="0 0 88 88" className="h-20 w-20 shrink-0" aria-hidden="true">
        {instance.isActive && (
          <polygon points="32,38 56,38 72,76 16,76" fill={beamColor} opacity={beamOpacity * 0.65} />
        )}
        <rect x="26" y="72" width="36" height="6" rx="3" fill="#475569" />
        <path d="M44 72 L44 38 L52 24" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M28 38 L60 38 L52 20 L36 20 Z"
          fill={instance.isActive ? '#d97706' : '#64748b'}
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="39" r="5" fill={instance.isActive ? beamColor : '#94a3b8'} />
      </svg>
    );
  }

  const coverMap: Record<string, {cover: string; spine: string}> = {
    松木綠: {cover: '#059669', spine: '#065f46'},
    靛藍布: {cover: '#0284c7', spine: '#075985'},
    赭紅皮: {cover: '#dc2626', spine: '#991b1b'},
  };
  const bookStyle = coverMap[instance.optionValue] ?? coverMap['松木綠'];
  const progressRatio = Math.min(1, Math.max(0.05, instance.metricValue / 200));

  return (
    <svg viewBox="0 0 88 88" className="h-20 w-20 shrink-0" aria-hidden="true">
      <rect x="20" y="16" width="48" height="58" rx="4" fill={bookStyle.cover} stroke="#0f172a" strokeWidth="2" />
      <rect x="20" y="16" width="10" height="58" rx="2" fill={bookStyle.spine} />
      <rect x="35" y="25" width="26" height="14" rx="2" fill="#f8fafc" />
      <line x1="39" y1="30" x2="57" y2="30" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="39" y1="35" x2="52" y2="35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <rect x="35" y="56" width="26" height="5" rx="2.5" fill="#1e293b" opacity="0.25" />
      <rect x="35" y="56" width={26 * progressRatio} height="5" rx="2.5" fill="#f8fafc" />
      <polygon points="56,16 62,16 62,30 59,26 56,30" fill="#fbbf24" />
    </svg>
  );
}
