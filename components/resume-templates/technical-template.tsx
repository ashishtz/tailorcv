import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

/**
 * Technical format: dense Helvetica layout that front-loads a categorised
 * skills block and gives projects equal weight to roles. ATS rules: one
 * column, no tables/icons/graphics, standard headings.
 */
export function TechnicalTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full px-10 py-8"
      style={{ minHeight: '11in', fontFamily: 'Helvetica, Arial, sans-serif' }}
    >
      <header className="mb-4 border-b-2 border-black pb-3">
        <NameTag className="text-[24px] font-bold leading-tight tracking-wide text-black">
          {data.contact.name}
        </NameTag>
        <div className="mt-1 text-[12px] leading-snug text-gray-800">
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
        <section className="mb-4">
          <SectionTitle>Professional Summary</SectionTitle>
          <div className="text-[12.5px] leading-relaxed text-gray-900">
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-4">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-0.5 text-[12.5px] leading-relaxed text-gray-900">
            {data.skills.map((group, index) => (
              <p key={index} className="break-inside-avoid">
                <span className="font-bold">{group.category}: </span>
                {group.skills.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mb-4">
          <SectionTitle>Work Experience</SectionTitle>
          <div className="space-y-3.5">
            {data.workExperience.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <p className="text-[13px] font-bold text-black">
                  {exp.position}
                  {exp.company ? `, ${exp.company}` : ''}
                </p>
                <p className="text-[12px] text-gray-700">
                  {[exp.duration, exp.location, exp.type].filter(Boolean).join('  |  ')}
                </p>
                <div className="mt-1 text-[12.5px] leading-relaxed text-gray-900">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-4">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-2.5">
            {data.projects.map((project, index) => (
              <div key={index} className="break-inside-avoid">
                <p className="text-[13px] font-bold text-black">
                  {project.name}
                  {project.role ? `, ${project.role}` : ''}
                </p>
                {project.link && (
                  <p className="text-[12px] text-gray-700">Link: {stripScheme(project.link)}</p>
                )}
                <div className="mt-1 text-[12.5px] leading-relaxed text-gray-900">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-1.5 text-[12.5px] leading-relaxed">
            {data.education.map((edu, index) => (
              <div key={index} className="break-inside-avoid">
                <p className="font-bold text-black">
                  {[edu.degree, edu.field].filter(Boolean).join(', ')}
                </p>
                <p className="text-gray-900">
                  {[edu.institution, edu.duration].filter(Boolean).join('  |  ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-black">
      {children}
    </h2>
  )
}
