import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

const TEAL = '#0b7a6e'

/**
 * Modern: colour-led but still strictly one column of real text - a heavy
 * accent bar, teal section rules and tinted skill chips. Nothing is an image,
 * table or text box, and chips are dark text on a light tint so the sheet
 * still reads if background graphics are dropped at print time.
 */
export function ModernTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full"
      style={{ minHeight: '11in', fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      <div style={{ height: 10, backgroundColor: TEAL }} />

      <div className="px-10 pb-10 pt-7">
        <header className="mb-6">
          <NameTag className="text-[32px] font-bold leading-none tracking-tight text-stone-900">
            {data.contact.name}
          </NameTag>
          <div className="mt-2.5 text-[12.5px] leading-relaxed text-stone-600">
            <p>
              {[data.contact.email, data.contact.phone, data.contact.location]
                .filter(Boolean)
                .join('  •  ')}
            </p>
            {data.contact.address && <p>{data.contact.address}</p>}
            <ContactLinks links={data.contact.socialLinks} variant="labels" />
          </div>
        </header>

        {data.summary && (
          <Section title="Professional Summary">
            <div className="text-[13px] leading-[1.65] text-stone-800">
              {renderFormattedContent(data.summary, settings?.summary_format)}
            </div>
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section title="Skills">
            <div className="space-y-2.5">
              {data.skills.map((group, index) => (
                <div key={index} className="break-inside-avoid">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {group.category}
                  </p>
                  <p className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full px-2.5 py-0.5 text-[12px] text-stone-800"
                        style={{ backgroundColor: '#e6f4f2' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.workExperience.length > 0 && (
          <Section title="Work Experience">
            <div className="space-y-5">
              {data.workExperience.map((exp, index) => (
                <div key={index} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className="text-[15px] font-bold text-stone-900">{exp.position}</p>
                    <p className="text-[12px] font-semibold" style={{ color: TEAL }}>
                      {exp.duration}
                    </p>
                  </div>
                  <p className="text-[12.5px] text-stone-600">
                    {[exp.company, exp.location, exp.type].filter(Boolean).join('  •  ')}
                  </p>
                  <div className="mt-1.5 text-[13px] leading-[1.65] text-stone-800">
                    {renderFormattedContent(exp.description, settings?.work_experience_format)}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-3.5">
              {data.projects.map((project, index) => (
                <div key={index} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className="text-[14px] font-bold text-stone-900">
                      {project.name}
                      {project.role ? (
                        <span className="font-normal text-stone-600"> / {project.role}</span>
                      ) : null}
                    </p>
                    {project.link && (
                      <p className="text-[12px]" style={{ color: TEAL }}>
                        {stripScheme(project.link)}
                      </p>
                    )}
                  </div>
                  <div className="mt-1 text-[13px] leading-[1.65] text-stone-800">
                    {renderFormattedContent(project.description, settings?.projects_format)}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title="Education" last>
            <div className="space-y-2.5">
              {data.education.map((edu, index) => (
                <div
                  key={index}
                  className="break-inside-avoid flex flex-wrap items-baseline justify-between gap-x-4 text-[13px]"
                >
                  <div>
                    <p className="font-bold text-stone-900">{edu.institution}</p>
                    <p className="text-stone-700">
                      {[edu.degree, edu.field].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <p className="text-[12px] font-semibold" style={{ color: TEAL }}>
                    {edu.duration}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
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
    <section className={last ? undefined : 'mb-6'}>
      <h2
        className="mb-2.5 pb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-stone-900"
        style={{ borderBottom: `2px solid ${TEAL}` }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
