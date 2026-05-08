// menu.js — sidebar nav config
export const MENU = [
  { section: '🥷 정원' },
  { id: 'dashboard', label: '대시보드', icon: '🏯', view: 'dashboard' },
  { id: 'worldview', label: '세계관', icon: '🥷', view: 'worldview' },

  { section: '🌱 정원지기' },
  { id: 'agents',    label: '에이전트', icon: '👥', view: 'agents' },
  { id: 'engine',    label: '엔진', icon: '⚙️', view: 'engine' },

  { section: '☀️ 햇빛' },
  { id: 'knowledge', label: '지식 (Knowledge)', icon: '📚', view: 'knowledge' },

  { section: '📜 정원 일지' },
  { id: 'docs',      label: '버전 히스토리', icon: '📝', view: 'docs' },
  { id: 'logs',      label: '활동 로그', icon: '🗂️', view: 'logs' },

  { section: '🌟 별과 지도' },
  { id: 'pdsa',      label: 'PDSA 인사이트', icon: '🐸', view: 'pdsa' },
  { id: 'about',     label: '이 지도에 대해', icon: '🗺️', view: 'about' },
];

export const HOME = 'dashboard';
