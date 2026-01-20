import { Resume } from '@/lib/types/database'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { Fragment } from 'react'

interface JakeTemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
}

export function JakeTemplate({ data, settings }: JakeTemplateProps) {
  return (
    <div className="bg-white px-10 py-8 w-full font-libre-baskerville" style={{ minHeight: '11in' }}>
      {/* Header Section - Centered with small caps name */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide" style={{ fontVariant: 'small-caps' }}>
          {data.contact.name}
        </h1>
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
            {data.contact.socialLinks?.linkedin && (
              <>
                {' | '}
                <span className="underline">
                  {data.contact.socialLinks.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              </>
            )}
            {data.contact.socialLinks?.github && (
              <>
                {' | '}
                <span className="underline">
                  {data.contact.socialLinks.github.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              </>
            )}
            {data.contact.socialLinks?.stackoverflow && (
              <>
                {' | '}
                <span className="underline">
                  {data.contact.socialLinks.stackoverflow.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              </>
            )}
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
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-900">{edu.institution}</span>
                    {data.contact.location && (
                      <span className="text-gray-800">, {data.contact.location}</span>
                    )}
                  </div>
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
              <div key={index}>
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
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-900">{project.name}</span>
                    {project.role && (
                      <span className="text-gray-800 italic text-sm"> | {project.role}</span>
                    )}
                  </div>
                  {project.link && (
                    <span className="text-sm text-gray-600 underline">
                      {project.link.replace(/^https?:\/\/(www\.)?/, '')}
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
          {typeof data.skills[0] === 'string' ? (
            <p className="text-sm text-gray-800">
              <span className="font-bold">Skills: </span>
              {(data.skills as string[]).join(', ')}
            </p>
          ) : (
            <div className="space-y-1">
              {(data.skills as Array<{ category: string; skills: string[] }>).map((category, index) => (
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
          )}
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
