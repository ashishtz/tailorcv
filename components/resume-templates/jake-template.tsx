import type { TemplateProps } from '@/lib/templates'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { Fragment } from 'react'
import { ContactLinks, stripScheme } from './shared'

export function JakeTemplate({ data, settings, nameTag: NameTag = 'h1' }: TemplateProps) {
  return (
    <div className="bg-white px-10 py-8 w-full font-libre-baskerville" style={{ minHeight: '11in' }}>
      {/* Header Section - Centered with small caps name */}
      <header className="text-center mb-4">
        <NameTag className="text-3xl font-bold text-gray-900 tracking-wide" style={{ fontVariant: 'small-caps' }}>
          {data.contact.name}
        </NameTag>
        <div className="text-sm text-gray-800 mt-1">
          {/* Contact info on one line with pipe separators */}
          <p>
            {data.contact.phone}
            {data.contact.email && (
              <>
                {' | '}
                <span className="underline">{data.contact.email}</span>
              </>
            )}
            <ContactLinks links={data.contact.socialLinks} variant="inline" linkClassName="underline" />
          </p>
        </div>
      </header>

      {/* Education Section */}
      {data.education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-900 pb-0.5 mb-2" style={{ fontVariant: 'small-caps' }}>
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-900">{edu.institution}</span>
                  <span className="text-sm text-gray-800 text-right">{edu.duration}</span>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 italic text-sm">
                    {edu.degree} in {edu.field}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {data.workExperience && data.workExperience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-900 pb-0.5 mb-2" style={{ fontVariant: 'small-caps' }}>
            Experience
          </h2>
          <div className="space-y-3">
            {data.workExperience.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-900">{exp.position}</span>
                  <span className="text-sm text-gray-800">{exp.duration}</span>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 italic text-sm">
                    {exp.company}, {exp.location}
                  </p>
                </div>
                <div className="mt-1 text-sm">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-900 pb-0.5 mb-2" style={{ fontVariant: 'small-caps' }}>
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-900">{project.name}</span>
                    {project.role && (
                      <span className="text-gray-800 italic text-sm"> | {project.role}</span>
                    )}
                  </div>
                  {project.link && (
                    <span className="text-sm text-gray-600 underline">
                      {stripScheme(project.link)}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills Section */}
      {data.skills.length > 0 && (
        <section className="mb-3">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-900 pb-0.5 mb-2" style={{ fontVariant: 'small-caps' }}>
            Technical Skills
          </h2>
          <div className="space-y-1">
            {data.skills.map((category, index) => (
              <p key={index} className="text-sm text-gray-800">
                <span className="font-bold">{category.category}: </span>
                {category.skills.map((skill, skillIndex) => (
                  <Fragment key={skillIndex}>
                    {skill}{skillIndex < category.skills.length - 1 ? ', ' : ''}
                  </Fragment>
                ))}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Professional Summary - placed at end like some LaTeX templates */}
      {data.summary && (
        <section className="mb-3">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-900 pb-0.5 mb-2" style={{ fontVariant: 'small-caps' }}>
            Summary
          </h2>
          <div className="text-sm">
            {renderFormattedContent(data.summary, settings?.summary_format)}
          </div>
        </section>
      )}
    </div>
  )
}
