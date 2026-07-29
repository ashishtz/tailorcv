import { Fragment } from 'react'
import { Resume } from '@/lib/types/database'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'

export function stripScheme(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '')
}

const SOCIAL_LINKS = [
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'github', label: 'GitHub', Icon: GitHubIcon },
  { key: 'stackoverflow', label: 'StackOverflow', Icon: StackOverflowIcon },
] as const

interface ContactLinksProps {
  links: Resume['generated_data']['contact']['socialLinks']
  /**
   * 'icons' (default): icon anchors in a wrapper div (className) — modern/minimal/professional.
   * 'labels': "LinkedIn: url | GitHub: url" text in a <p className> — classic (ATS).
   * 'inline': " | url" spans (linkClassName) for embedding in an existing line — jake.
   */
  variant?: 'icons' | 'labels' | 'inline'
  className?: string
  linkClassName?: string
}

export function ContactLinks({ links, variant = 'icons', className, linkClassName }: ContactLinksProps) {
  const present = SOCIAL_LINKS.flatMap(({ key, label, Icon }) => {
    const url = links?.[key]
    return url ? [{ key, label, Icon, url }] : []
  })
  if (present.length === 0) return null

  if (variant === 'labels') {
    return (
      <p className={className}>
        {present.map(({ key, label, url }, i) => (
          <Fragment key={key}>
            {i > 0 && ' | '}
            <span>{label}: {stripScheme(url)}</span>
          </Fragment>
        ))}
      </p>
    )
  }

  if (variant === 'inline') {
    return (
      <>
        {present.map(({ key, url }) => (
          <Fragment key={key}>
            {' | '}
            <span className={linkClassName}>{stripScheme(url)}</span>
          </Fragment>
        ))}
      </>
    )
  }

  return (
    <div className={className}>
      {present.map(({ key, url, Icon }) => (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  )
}
