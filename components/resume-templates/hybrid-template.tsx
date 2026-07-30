import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

/**
 * Hybrid (combination) format: skills sit above experience so transferable
 * strengths land first, while section order and headings stay standard.
 * ATS rules: one column, no tables/icons/graphics, Arial stack, plain bullets.
 */
export function HybridTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full px-10 py-9"
      style={{ minHeight: '11in', fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      <header className="mb-5">
        <NameTag className="text-[26px] font-bold leading-tight text-black">
          {data.contact.name}
        </NameTag>
        <div className="mt-1.5 text-[13px] leading-relaxed text-gray-800">
          <p>
            {[data.contact.email, data.contact.phone, data.contact.location]
              .filter(Boolean)
              .join(' | ')}
          </p>
          {data.contact.address && <p>{data.contact.address}</p>}
          <ContactLinks links={data.contact.socialLinks} variant="labels" />
        </div>
      </header>

      {data.summary && (
        <section className="mb-5">
          <SectionTitle>Professional Summary</SectionTitle>
          <div className="text-[13px] leading-relaxed text-gray-900">
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-5">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1 text-[13px] leading-relaxed text-gray-900">
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
        <section className="mb-5">
          <SectionTitle>Work Experience</SectionTitle>
          <div className="space-y-4">
            {data.workExperience.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <p className="text-[14px] font-bold text-black">{exp.position}</p>
                <p className="text-[13px] text-gray-800">
                  {[exp.company, exp.location, exp.type].filter(Boolean).join(' | ')}
                </p>
                <p className="text-[12px] text-gray-700">{exp.duration}</p>
                <div className="mt-1 text-[13px] leading-relaxed text-gray-900">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-5">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index} className="break-inside-avoid">
                <p className="text-[14px] font-bold text-black">{project.name}</p>
                {project.role && <p className="text-[13px] text-gray-800">{project.role}</p>}
                {project.link && (
                  <p className="text-[12px] text-gray-700">Link: {stripScheme(project.link)}</p>
                )}
                <div className="mt-1 text-[13px] leading-relaxed text-gray-900">
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
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="break-inside-avoid text-[13px] leading-relaxed">
                <p className="font-bold text-black">{edu.institution}</p>
                <p className="text-gray-900">
                  {[edu.degree, edu.field].filter(Boolean).join(', ')}
                </p>
                <p className="text-[12px] text-gray-700">{edu.duration}</p>
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
    <h2 className="mb-2 border-b border-gray-400 pb-1 text-[13px] font-bold uppercase tracking-wider text-black">
      {children}
    </h2>
  )
}
