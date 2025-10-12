import { createClient } from '@/lib/supabase/server'
import { LandingHeader } from '@/components/landing/header'
import { FloatingParticles } from '@/components/landing/floating-particles'
import { AnimatedShapes } from '@/components/landing/animated-shapes'
import { TemplatePreview } from '@/components/landing/template-preview'
import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Target,
  FileText,
  CheckCircle,
  ArrowRight,
  Layout,
  Palette,
  Bot
} from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader isAuthenticated={!!user} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50/30 to-accent-50/20"></div>
        <FloatingParticles />
        <AnimatedShapes />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-400"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6 animate-slide-up">
              <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-sm font-semibold text-primary-700">
                AI-Powered Resume Builder
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up animation-delay-100 font-poppins">
              Create Your{' '}
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                Perfect Resume
              </span>
              <br />
              in Minutes
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200 font-inter">
              Stand out from the crowd with AI-powered, ATS-friendly resumes tailored to your dream job.
              Professional templates, intelligent highlighting, and instant generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-300">
              <Link
                href={user ? '/dashboard' : '/auth/register'}
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-large hover:shadow-xl transform hover:-translate-y-1 flex items-center"
              >
                {user ? 'Go to Dashboard' : 'Start Building Free'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-lg hover:border-primary-600 hover:text-primary-600 transition-all duration-200 shadow-soft hover:shadow-medium"
              >
                See How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up animation-delay-400">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Resumes Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-3xl opacity-20 animate-pulse-slow" />

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Land Your Dream Job
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-inter">
              Powerful features designed to help you create professional, standout resumes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: 'AI-Powered Generation',
                description:
                  'Let AI craft perfect resume content tailored to each job description with intelligent keyword matching.',
                gradient: 'from-primary-600 to-primary-700'
              },
              {
                icon: Sparkles,
                title: 'Smart Highlighting',
                description:
                  'Automatically highlights your most relevant skills and experiences that match job requirements.',
                gradient: 'from-secondary-600 to-secondary-700'
              },
              {
                icon: Layout,
                title: '6 Professional Templates',
                description:
                  'Choose from Classic, Modern, Minimal, Professional, Creative, and Executive designs.',
                gradient: 'from-accent-600 to-accent-700'
              },
              {
                icon: Target,
                title: 'ATS-Optimized',
                description:
                  'Formats designed to pass Applicant Tracking Systems and get your resume noticed.',
                gradient: 'from-primary-600 to-secondary-600'
              },
              {
                icon: Zap,
                title: 'Instant Generation',
                description:
                  'Create a complete, professional resume in seconds. No more hours of formatting.',
                gradient: 'from-secondary-600 to-accent-600'
              },
              {
                icon: Palette,
                title: 'Customizable Formats',
                description:
                  'Choose between bullet points or paragraphs for each section. Full control over your resume style.',
                gradient: 'from-accent-600 to-primary-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-scale-in overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-medium group-hover:shadow-large`}
                  >
                    <feature.icon className="h-6 w-6 text-white group-hover:animate-pulse-slow" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-300 font-poppins">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-inter">{feature.description}</p>
                </div>

                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-300 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
              Create Your Resume in{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-inter">
              From profile setup to professional resume in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Complete Your Profile',
                description:
                  'Fill in your personal information, skills, work experience, education, and projects once.',
                icon: FileText
              },
              {
                step: '02',
                title: 'Paste Job Description',
                description:
                  'Simply paste the job description for the position you want to apply for.',
                icon: Target
              },
              {
                step: '03',
                title: 'Generate & Download',
                description:
                  'Let AI create a tailored resume. Download as PDF and apply with confidence!',
                icon: CheckCircle
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 overflow-hidden">
                    {/* Animated progress line */}
                    <div className="h-full w-1/3 bg-gradient-to-r from-primary-400 to-secondary-400 animate-pulse-slow" />
                  </div>
                )}
                <div className="relative bg-white p-8 rounded-xl shadow-medium hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="text-6xl font-bold text-primary-100 mb-4 group-hover:text-primary-200 transition-colors duration-300">
                      {step.step}
                    </div>
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-medium group-hover:shadow-large">
                      <step.icon className="h-6 w-6 text-white group-hover:animate-bounce-slow" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors duration-300 font-poppins">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-inter">{step.description}</p>
                  </div>

                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-400 to-primary-400 opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500 transform group-hover:scale-150" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-secondary-50/30 to-accent-50/20 overflow-hidden">
        {/* Animated decorative elements */}
        <AnimatedShapes />
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
              Beautiful{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Professional Templates
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-inter">
              Choose from 6 carefully designed templates that work for any industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Classic', 'Modern', 'Minimal', 'Professional', 'Creative', 'Executive'].map(
              (template, index) => (
                <div
                  key={index}
                  className="group relative bg-white p-6 rounded-xl shadow-medium hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
                >
                  {/* Animated background overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-secondary-600/10 to-accent-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="aspect-[3/4] bg-white rounded-lg mb-4 overflow-hidden border border-gray-200 group-hover:border-primary-300 transition-all duration-500 relative">
                      <TemplatePreview templateName={template} />
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-300 font-poppins">{template}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-inter">
                      Perfect for {template.toLowerCase()} roles
                    </p>
                  </div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-300 transition-colors duration-500" />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 rounded-3xl p-12 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
            <FloatingParticles />

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in font-poppins">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-xl text-primary-100 mb-8 font-inter">
                Join thousands of job seekers who have successfully created their perfect resume
              </p>
              <Link
                href={user ? '/dashboard' : '/auth/register'}
                className="inline-flex items-center px-8 py-4 bg-white text-primary-700 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-large hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-4 text-sm text-primary-100">
                No credit card required • Takes only 5 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Resume Builder</span>
              </div>
              <p className="text-sm text-gray-400">
                Create professional, ATS-friendly resumes in minutes with AI-powered technology.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-primary-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#templates" className="hover:text-primary-400 transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-primary-400 transition-colors">
                    How it Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition-colors">
                    Career Tips
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
