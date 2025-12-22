import { Resume } from '@/lib/types/database'
import { renderFormattedContent } from '@/lib/utils/render-content'
import { Fragment } from 'react'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'

interface ClassicTemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
}

export function ClassicTemplate({ data, settings }: ClassicTemplateProps) {
  return (
    <div className="bg-white p-8 w-full font-inter" style={{ minHeight: '11in' }}>
      {/* Header Section */}
      <header className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.contact.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium items-center">
          <span>{data.contact.email}</span>
          <span>•</span>
          <span>{data.contact.phone}</span>
          <span>•</span>
          <span>{data.contact.location}</span>
          {data.contact.socialLinks?.linkedin && (
            <>
              <span>•</span>
              <a href={data.contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
                <LinkedInIcon className="w-4 h-4" />
              </a>
            </>
          )}
          {data.contact.socialLinks?.github && (
            <>
              <span>•</span>
              <a href={data.contact.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
                <GitHubIcon className="w-4 h-4" />
              </a>
            </>
          )}
          {data.contact.socialLinks?.stackoverflow && (
            <>
              <span>•</span>
              <a href={data.contact.socialLinks.stackoverflow} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
                <StackOverflowIcon className="w-4 h-4" />
              </a>
            </>
          )}
        </div>
        {data.contact.address && (
          <div className="text-sm text-gray-600 mt-1">{data.contact.address}</div>
        )}
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">Professional Summary</h2>
          {renderFormattedContent(data.summary, settings?.summary_format)}
        </section>
      )}

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">Skills</h2>
          {typeof data.skills[0] === 'string' ? (
            <div className="flex flex-wrap gap-2">
              {(data.skills as string[]).map((skill, index) => (
                <span key={index} className="px-3 py-1 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(data.skills as Array<{ category: string; skills: string[] }>).map((category, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2 text-base">{category.category}:{' '}
                    <span className="text-sm font-medium">
                    {category.skills.map((skill, skillIndex) => (
                      <Fragment key={skillIndex}>
                        {skill}{skillIndex < category.skills.length - 1 ? ', ' : ''}
                      </Fragment>
                    ))}
                    </span>
                  </h3>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Work Experience Section */}
      {data.workExperience && data.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">Work Experience</h2>
          <div className="space-y-4">
            {data.workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                    <p className="text-gray-700 font-semibold">{exp.company} • {exp.location}</p>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <p>{exp.duration}</p>
                    <p className="text-xs">{exp.type}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  )}
                </div>
                {project.role && <p className="text-gray-700 text-sm font-semibold">{project.role}</p>}
                <div className="mt-1 text-sm">
                  {renderFormattedContent(project.description, settings?.projects_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                    <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                  </div>
                  <p className="text-sm text-gray-600">{edu.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}