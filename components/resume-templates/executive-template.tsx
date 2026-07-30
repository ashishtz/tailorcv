import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

/**
 * Executive format: centred serif masthead and generous leading for senior
 * roles, experience first. ATS rules: one column, no tables/icons/graphics,
 * Georgia stack, standard headings.
 */
export function ExecutiveTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full px-12 py-10"
      style={{ minHeight: '11in', fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <header className="mb-6 text-center">
        <NameTag className="text-[30px] font-bold leading-tight tracking-wide text-black">
          {data.contact.name}
        </NameTag>
        <div className="mt-2 text-[13px] leading-relaxed text-gray-800">
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
        <section className="mb-6">
          <SectionTitle>Professional Summary</SectionTitle>
          <div className="text-[14px] leading-[1.7] text-gray-900">
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Work Experience</SectionTitle>
          <div className="space-y-5">
            {data.workExperience.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[15px] font-bold text-black">{exp.position}</p>
                  <p className="text-[13px] text-gray-700">{exp.duration}</p>
                </div>
                <p className="text-[13px] italic text-gray-800">
                  {[exp.company, exp.location, exp.type].filter(Boolean).join(' | ')}
                </p>
                <div className="mt-1.5 text-[14px] leading-[1.7] text-gray-900">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1 text-[14px] leading-relaxed text-gray-900">
            {data.skills.map((group, index) => (
              <p key={index} className="break-inside-avoid">
                <span className="font-bold">{group.category}: </span>
                {group.skills.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-2 text-[14px] leading-relaxed">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="break-inside-avoid flex flex-wrap items-baseline justify-between gap-x-4"
              >
                <div>
                  <p className="font-bold text-black">{edu.institution}</p>
                  <p className="text-gray-900">
                    {[edu.degree, edu.field].filter(Boolean).join(', ')}
                  </p>
                </div>
                <p className="text-[13px] text-gray-700">{edu.duration}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section>
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index} className="break-inside-avoid">
                <p className="text-[15px] font-bold text-black">{project.name}</p>
                {project.role && <p className="text-[13px] italic text-gray-800">{project.role}</p>}
                {project.link && (
                  <p className="text-[13px] text-gray-700">Link: {stripScheme(project.link)}</p>
                )}
                <div className="mt-1 text-[14px] leading-[1.7] text-gray-900">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
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
    <h2
      className="mb-2.5 border-t border-gray-800 pt-2 text-center text-[13px] font-bold uppercase text-black"
      style={{ letterSpacing: '0.12em' }}
    >
      {children}
    </h2>
  )
}
