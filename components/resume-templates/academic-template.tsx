import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { ContactLinks, stripScheme } from './shared'

/**
 * Academic format: Times masthead with education promoted above experience,
 * the convention for research, teaching and graduate applications. ATS rules:
 * one column, no tables/icons/graphics, standard headings.
 */
export function AcademicTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div
      className="bg-white w-full px-11 py-10"
      style={{ minHeight: '11in', fontFamily: '"Times New Roman", Times, serif' }}
    >
      <header className="mb-5 text-center">
        <NameTag className="text-[28px] font-bold leading-tight text-black">
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
          <div className="text-[13.5px] leading-[1.65] text-gray-900">
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-5">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-2.5 text-[13.5px] leading-relaxed">
            {data.education.map((edu, index) => (
              <div key={index} className="break-inside-avoid">
                <p className="font-bold text-black">
                  {[edu.degree, edu.field].filter(Boolean).join(', ')}
                </p>
                <p className="italic text-gray-900">{edu.institution}</p>
                <p className="text-[12.5px] text-gray-700">{edu.duration}</p>
              </div>
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
                <p className="text-[13px] italic text-gray-900">
                  {[exp.company, exp.location].filter(Boolean).join(', ')}
                </p>
                <p className="text-[12.5px] text-gray-700">
                  {[exp.duration, exp.type].filter(Boolean).join(' | ')}
                </p>
                <div className="mt-1 text-[13.5px] leading-[1.65] text-gray-900">
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
                {project.role && <p className="text-[13px] italic text-gray-900">{project.role}</p>}
                {project.link && (
                  <p className="text-[12.5px] text-gray-700">Link: {stripScheme(project.link)}</p>
                )}
                <div className="mt-1 text-[13.5px] leading-[1.65] text-gray-900">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1 text-[13.5px] leading-relaxed text-gray-900">
            {data.skills.map((group, index) => (
              <p key={index} className="break-inside-avoid">
                <span className="font-bold">{group.category}: </span>
                {group.skills.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-2 border-b border-gray-800 pb-0.5 text-[13.5px] font-bold uppercase tracking-wide text-black">
      {children}
    </h2>
  )
}
