import { Resume } from '@/lib/types/database'
import { renderFormattedContent } from '@/lib/utils/render-content'

interface MinimalTemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
}

export function MinimalTemplate({ data, settings }: MinimalTemplateProps) {
  return (
    <div className="bg-white p-8 w-full shadow-lg font-source-sans" style={{ minHeight: '11in' }}>
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">{data.contact.name}</h1>
        <div className="text-gray-600 text-sm space-y-1">
          <p>{data.contact.email} • {data.contact.phone}</p>
          <p>{data.contact.location}</p>
          {data.contact.address && <p>{data.contact.address}</p>}
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <div className="border-l-2 border-gray-200 pl-4">
            <div className="text-gray-700 leading-relaxed italic">
              {renderFormattedContent(data.summary, settings?.summary_format)}
            </div>
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {data.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-widest">Experience</h2>
          <div className="space-y-6">
            {data.workExperience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-500 font-medium">{exp.duration}</span>
                </div>
                <p className="text-gray-700 mb-2 font-semibold">{exp.company}, {exp.location}</p>
                <div className="text-gray-600 text-sm">
                  {renderFormattedContent(exp.description, settings?.work_experience_format)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-widest">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">{edu.field}</p>
                  </div>
                  <span className="text-sm text-gray-500">{edu.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-widest">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    {project.role && <p className="text-gray-700 text-sm font-semibold">{project.role}</p>}
                    <div className="text-gray-600 text-sm mt-1">
                      {renderFormattedContent(project.description, settings?.projects_format)}
                    </div>
                  </div>
                  {project.link && (
                    <a href={project.link} className="text-gray-400 hover:text-gray-600 text-sm underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-widest">Skills</h2>
          <div className="border-l-2 border-gray-200 pl-4">
            {typeof data.skills[0] === 'string' ? (
              <p className="text-gray-700 leading-relaxed">
                {(data.skills as string[]).join(' • ')}
              </p>
            ) : (
              <div className="space-y-4">
                {(data.skills as Array<{ category: string; skills: string[] }>).map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800 mb-2">{category.category}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {category.skills.join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}