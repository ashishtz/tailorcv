import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New", monospace'
const SLATE = '#1e293b'

/**
 * Technical: an engineer's sheet - monospaced metadata, a slate rule down the
 * left of every entry and section headings that read like labels. Borders and
 * type do the work; no icons, tables or images.
 */
export function TechnicalTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full px-10 py-9"
      style={{ minHeight: '11in', fontFamily: 'Helvetica, Arial, sans-serif' }}
    >
      <header className="mb-6">
        <NameTag className="text-[27px] font-bold leading-none tracking-tight text-slate-900">
          {data.contact.name}
        </NameTag>
        <div className="mt-2 text-[11.5px] leading-relaxed text-slate-600" style={{ fontFamily: MONO }}>
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
          <div className="text-[12.5px] leading-relaxed text-slate-800">
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills">
          <div className="space-y-1.5">
            {data.skills.map((group, index) => (
              <p key={index} className="break-inside-avoid text-[12.5px] leading-relaxed">
                <span
                  className="inline-block min-w-[120px] font-bold text-slate-900"
                  style={{ fontFamily: MONO, fontSize: '11.5px' }}
                >
                  {group.category}
                </span>
                <span className="text-slate-700">{group.skills.join(', ')}</span>
              </p>
            ))}
          </div>
        </Section>
      )}

      {data.workExperience.length > 0 && (
        <Section title="Work Experience">
          <div className="space-y-4">
            {data.workExperience.map((exp, index) => (
              <div
                key={index}
                className="break-inside-avoid pl-4"
                style={{ borderLeft: `2px solid ${SLATE}` }}
              >
                <p className="text-[13.5px] font-bold text-slate-900">{exp.position}</p>
                <p className="text-[11.5px] text-slate-600" style={{ fontFamily: MONO }}>
                  {[exp.company, exp.location, exp.type, exp.duration].filter(Boolean).join('  ·  ')}
                </p>
                <div className="mt-1.5 text-[12.5px] leading-relaxed text-slate-800">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div
                key={index}
                className="break-inside-avoid pl-4"
                style={{ borderLeft: `2px solid #94a3b8` }}
              >
                <p className="text-[13.5px] font-bold text-slate-900">{project.name}</p>
                <p className="text-[11.5px] text-slate-600" style={{ fontFamily: MONO }}>
                  {[project.role, project.link && stripScheme(project.link)]
                    .filter(Boolean)
                    .join('  ·  ')}
                </p>
                <div className="mt-1.5 text-[12.5px] leading-relaxed text-slate-800">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education" last>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="break-inside-avoid text-[12.5px] leading-relaxed">
                <p className="font-bold text-slate-900">
                  {[edu.degree, edu.field].filter(Boolean).join(', ')}
                </p>
                <p className="text-[11.5px] text-slate-600" style={{ fontFamily: MONO }}>
                  {[edu.institution, edu.duration].filter(Boolean).join('  ·  ')}
                </p>
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
    <section className={last ? undefined : 'mb-6'}>
      <h2
        className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
        style={{ fontFamily: MONO, backgroundColor: SLATE, padding: '3px 8px', display: 'inline-block' }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
