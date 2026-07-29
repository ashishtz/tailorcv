import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, CheckCircle, ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8 animate-fade-in">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-lg text-gray-600">
            Here&apos;s what&apos;s happening with your resumes today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Resumes Card */}
          <div className="bg-white overflow-hidden rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-1 animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Resumes</p>
                  <p className="text-3xl font-bold bg-linear-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">0</p>
                </div>
                <div className="bg-linear-to-br from-primary-500 to-primary-600 rounded-lg p-3">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Status Card */}
          <div className="bg-white overflow-hidden rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-1 animate-scale-in animation-delay-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Profile Status</p>
                  <p className="text-lg font-semibold text-green-600 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete
                  </p>
                </div>
                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-3">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-linear-to-br from-accent-600 to-accent-700 overflow-hidden rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-1 animate-scale-in animation-delay-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-accent-100 mb-3">Quick Actions</p>
                  <Link
                    href="/dashboard/documents"
                    className="group inline-flex items-center text-white font-semibold hover:text-accent-100 transition-colors duration-200"
                  >
                    Generate Resume
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-12 animate-slide-up animation-delay-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-7 w-7 mr-3 text-primary-600" />
            Getting Started
          </h2>
          <div className="bg-white shadow-soft rounded-lg p-8 border border-gray-100">
            <div className="flex items-start">
              <div className="shrink-0">
                <div className="bg-linear-to-br from-primary-500 to-primary-600 rounded-lg p-3">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You&apos;re all set!
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your profile is set up and ready to go! You can now generate AI-powered resumes
                  tailored to specific job positions. Our intelligent system will analyze job descriptions
                  and highlight your most relevant skills and experiences.
                </p>
                <Link
                  href="/dashboard/documents"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-medium hover:shadow-large transform hover:-translate-y-0.5"
                >
                  Create Your First Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up animation-delay-400">
          <div className="bg-linear-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
            <h3 className="text-lg font-semibold text-primary-900 mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary-600" />
              Pro Tip: Strict vs Free Mode
            </h3>
            <p className="text-primary-800 text-sm leading-relaxed">
              Use <span className="font-semibold">Strict Mode</span> to stay within your profile data, or try <span className="font-semibold">Free Mode</span> to let AI enhance your content based on job requirements.
            </p>
          </div>

          <div className="bg-linear-to-br from-secondary-50 to-secondary-100 rounded-lg p-6 border border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-secondary-600" />
              Multiple Templates Available
            </h3>
            <p className="text-secondary-800 text-sm leading-relaxed">
              Choose from Classic, Modern, Minimal, Professional, Creative, and Executive templates to match your industry and personal style.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}