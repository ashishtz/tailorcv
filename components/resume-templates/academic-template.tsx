import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

const MAROON = '#7c2230'

/**
 * Academic: scholarly Times setting with a maroon rule under the name,
 * maroon small-caps headings and hanging-indent entries with the year set in
 * a left gutter. Education leads, as convention expects. One column of text.
 */
export function AcademicTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full px-11 py-10"
      style={{ minHeight: '11in', fontFamily: '"Times New Roman", Times, serif' }}
    >
      <header className="mb-6">
        <NameTag className="text-[30px] font-bold leading-none text-black">
          {data.contact.name}
        </NameTag>
        <div style={{ borderBottom: `2px solid ${MAROON}`, marginTop: 8, marginBottom: 8 }} />
        <div className="text-[13px] leading-relaxed italic text-gray-800">
          <p>
            {[data.contact.email, data.contact.phone, data.contact.location]
              .filter(Boolean)
              .join('  ·  ')}
          </p>
          {data.contact.address && <p>{data.contact.address}</p>}
          <ContactLinks links={data.contact.socialLinks} variant="labels" />
        </div>
      </header>

      {data.summary && (
        <Section title="Professional Summary">
          <div className="text-[13.5px] leading-[1.7] text-gray-900">
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <Entry key={index} gutter={edu.duration}>
                <p className="text-[14px] font-bold text-black">
                  {[edu.degree, edu.field].filter(Boolean).join(', ')}
                </p>
                <p className="text-[13.5px] italic text-gray-900">{edu.institution}</p>
              </Entry>
            ))}
          </div>
        </Section>
      )}

      {data.workExperience.length > 0 && (
        <Section title="Work Experience">
          <div className="space-y-4">
            {data.workExperience.map((exp, index) => (
              <Entry key={index} gutter={exp.duration}>
                <p className="text-[14px] font-bold text-black">{exp.position}</p>
                <p className="text-[13.5px] italic text-gray-900">
                  {[exp.company, exp.location, exp.type].filter(Boolean).join(', ')}
                </p>
                <div className="mt-1 text-[13.5px] leading-[1.7] text-gray-900">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </Entry>
            ))}
          </div>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3.5">
            {data.projects.map((project, index) => (
              <Entry key={index} gutter={project.link ? stripScheme(project.link) : ''}>
                <p className="text-[14px] font-bold text-black">{project.name}</p>
                {project.role && (
                  <p className="text-[13.5px] italic text-gray-900">{project.role}</p>
                )}
                <div className="mt-1 text-[13.5px] leading-[1.7] text-gray-900">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
              </Entry>
            ))}
          </div>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills" last>
          <div className="space-y-1.5 text-[13.5px] leading-relaxed text-gray-900">
            {data.skills.map((group, index) => (
              <p key={index} className="break-inside-avoid">
                <span className="font-bold">{group.category}. </span>
                {group.skills.join(', ')}
              </p>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

/** Year (or link) in a left gutter, body hanging beside it. */
function Entry({ gutter, children }: { gutter: string; children: React.ReactNode }) {
  return (
    <div className="break-inside-avoid flex gap-4">
      <p className="w-[104px] shrink-0 pt-0.5 text-[12px]" style={{ color: MAROON }}>
        {gutter}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
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
        className="mb-2.5 text-[13px] font-bold uppercase"
        style={{ letterSpacing: '0.18em', color: MAROON }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
