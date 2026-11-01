import {
  siCss,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMysql,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siReact,
  siSupabase,
  type SimpleIcon,
} from 'simple-icons'
import { CodeXml } from 'lucide-react'
import type { SkillIcon } from '@/lib/portfolio-data'

const icons: Partial<Record<SkillIcon, SimpleIcon>> = {
  html: siHtml5,
  css: siCss,
  javascript: siJavascript,
  react: siReact,
  php: siPhp,
  node: siNodedotjs,
  mysql: siMysql,
  postgresql: siPostgresql,
  supabase: siSupabase,
  git: siGit,
  github: siGithub,
}

export function BrandIcon({ name, className }: { name: SkillIcon; className?: string }) {
  const icon = icons[name]
  if (!icon) return <CodeXml className={className} aria-hidden="true" />
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={siGithub.path} />
    </svg>
  )
}
