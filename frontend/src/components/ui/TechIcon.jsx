import React from 'react'
import {
  SiPython,
  SiJavascript,
  SiDjango,
  SiReact,
  SiRedux,
  SiHtml5,
  SiCss,
  SiPostgresql,
  SiSqlite,
  SiTailwindcss,
  SiGit,
  SiGithub,
} from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import {
  TbApi,
  TbBrandVite,
} from 'react-icons/tb'
import {
  LuKeyRound,
  LuDatabase,
  LuShieldCheck,
  LuWorkflow,
  LuServer,
  LuCode,
  LuLayers,
  LuFileText,
  LuCpu,
} from 'react-icons/lu'

const ICON_MAP = {
  SiPython,
  SiJavascript,
  SiDjango,
  SiReact,
  SiRedux,
  SiHtml5,
  SiCss,
  SiPostgresql,
  SiSqlite,
  SiTailwindcss,
  SiGit,
  SiGithub,
  FaLinkedin,
  TbApi,
  TbBrandVite,
  LuKeyRound,
  LuDatabase,
  LuShieldCheck,
  LuWorkflow,
  LuServer,
  LuCode,
  LuLayers,
  LuFileText,
  LuCpu,
}

const NAME_ICON_MAP = {
  python: SiPython,
  javascript: SiJavascript,
  django: SiDjango,
  'django rest framework': SiDjango,
  react: SiReact,
  'react.js': SiReact,
  redux: SiRedux,
  html5: SiHtml5,
  css3: SiCss,
  css: SiCss,
  postgresql: SiPostgresql,
  sqlite: SiSqlite,
  rbac: LuShieldCheck,
  'role-based access control (rbac)': LuShieldCheck,
  'rest api': TbApi,
  'rest api development': TbApi,
  authentication: LuKeyRound,
  crud: LuDatabase,
  'api integration': LuWorkflow,
  'database management': LuServer,
}

export function TechIcon({ name, iconName, className = 'w-4 h-4', ...props }) {
  if (iconName && ICON_MAP[iconName]) {
    const IconComponent = ICON_MAP[iconName]
    return <IconComponent className={className} aria-hidden="true" {...props} />
  }

  if (name) {
    const key = name.toLowerCase().trim()
    const IconComponent = NAME_ICON_MAP[key]
    if (IconComponent) {
      return <IconComponent className={className} aria-hidden="true" {...props} />
    }
  }

  return <LuCode className={className} aria-hidden="true" {...props} />
}
