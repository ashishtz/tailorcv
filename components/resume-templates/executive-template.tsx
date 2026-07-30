import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

const INK = '#1c2b3a'

/**
 * Executive: a formal masthead - wide-tracked name between double rules, a
 * tinted band for the summary and centred small-caps headings flanked by
 * hairlines. Structure stays one column of real text.
 */
export function ExecutiveTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full px-12 py-10"
      style={{ minHeight: '11in', fontFamily: 'Georgia, "Times New Roman", serif', color: INK }}
    >
      <header className="mb-7 text-center">
        <div style={{ borderTop: `3px solid ${INK}`, borderBottom: `1px solid ${INK}` }}>
          <NameTag
            className="py-3 text-[30px] font-bold leading-none"
            style={{ letterSpacing: '0.14em' }}
          >
            {data.contact.name.toUpperCase()}
          </NameTag>
        </div>
        <div className="mt-2.5 text-[12.5px] leading-relaxed" style={{ color: '#46586b' }}>
          <p>
            {[data.contact.email, data.contact.phone, data.contact.location]
              .filter(Boolean)
              .join('  |  ')}
          </p>
          {data.contact.address && <p>{data.contact.address}</p>}
          <ContactLinks links={data.contact.socialLinks} variant="labels" />
        </div>
      </header>

      {data.summary && (
        <section className="mb-7">
          <div
            className="px-6 py-4 text-[14px] leading-[1.75]"
            style={{ backgroundColor: '#f1f4f7', borderLeft: `3px solid ${INK}` }}
          >
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <Section title="Work Experience">
          <div className="space-y-5">
            {data.workExperience.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[16px] font-bold">{exp.position}</p>
                  <p className="text-[12.5px]" style={{ color: '#46586b' }}>
                    {exp.duration}
                  </p>
                </div>
                <p className="text-[13px] italic" style={{ color: '#46586b' }}>
                  {[exp.company, exp.location, exp.type].filter(Boolean).join('  |  ')}
                </p>
                <div className="mt-1.5 text-[14px] leading-[1.75]">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills">
          <div className="space-y-1.5 text-[14px] leading-relaxed">
            {data.skills.map((group, index) => (
              <p key={index} className="break-inside-avoid">
                <span className="font-bold">{group.category}</span>
                <span style={{ color: '#46586b' }}> &nbsp;|&nbsp; </span>
                {group.skills.join(', ')}
              </p>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-2.5 text-[14px] leading-relaxed">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="break-inside-avoid flex flex-wrap items-baseline justify-between gap-x-4"
              >
                <div>
                  <p className="font-bold">{edu.institution}</p>
                  <p>{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>
                </div>
                <p className="text-[12.5px]" style={{ color: '#46586b' }}>
                  {edu.duration}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects" last>
          <div className="space-y-3.5">
            {data.projects.map((project, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[15px] font-bold">{project.name}</p>
                  {project.link && (
                    <p className="text-[12.5px]" style={{ color: '#46586b' }}>
                      {stripScheme(project.link)}
                    </p>
                  )}
                </div>
                {project.role && (
                  <p className="text-[13px] italic" style={{ color: '#46586b' }}>
                    {project.role}
                  </p>
                )}
                <div className="mt-1 text-[14px] leading-[1.75]">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  children,
  last,
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <section className={last ? undefined : 'mb-7'}>
      {/* Hairlines either side of a centred label - decoration via borders,
          so the heading itself stays plain text for parsers. */}
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px flex-1" style={{ backgroundColor: '#c3cdd8' }} aria-hidden />
        <h2
          className="text-[12.5px] font-bold uppercase"
          style={{ letterSpacing: '0.22em', color: INK }}
        >
          {title}
        </h2>
        <span className="h-px flex-1" style={{ backgroundColor: '#c3cdd8' }} aria-hidden />
      </div>
      {children}
    </section>
  )
}
