import Header from '@/components/custom/Header'
import { UserButton } from '@clerk/clerk-react'
import { AtomIcon, Edit, Share2 } from 'lucide-react'
import React from 'react'

function Home() {
  return (
    <div>
      {/* Custom Header Component */}
      <Header />

      <div>
        {/* 
          You can uncomment the background image if you want that grid effect:
          <img
            src={'/grid.svg'}
            className="absolute z-[-10] w-full"
            width={1200}
            height={300}
            alt="Background Grid"
          />
        */}

        {/* HERO / LANDING SECTION */}
        <section className="z-50">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

            {/* 'New' Alert / Banner mentioning 'Built by KSHITIJ. PATHAK' */}
            <a
              href="#"
              className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 
                         text-sm text-gray-700 bg-gray-100 rounded-full 
                         dark:bg-gray-800 dark:text-white 
                         hover:bg-gray-200 dark:hover:bg-gray-700"
              role="alert"
            >
              <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">
                New
              </span>
              <span className="text-sm font-medium">
                Built by KSHITIJ PATHAK
              </span>
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 
                  010-1.414L10.586 10 
                  7.293 6.707a1 1 0 
                  011.414-1.414l4 4a1 1 0 
                  010 1.414l-4 4a1 1 0 
                  01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>

            {/* Main Title */}
            <h1
              className="mb-4 text-4xl font-extrabold tracking-tight 
                         leading-none text-gray-900 md:text-5xl 
                         lg:text-6xl dark:text-white"
            >
              Build Your Resume <span className="text-primary">With AI</span>
            </h1>

            {/* Subheading */}
            <p
              className="mb-8 text-lg font-normal text-gray-500 
                         lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
            >
              Simplify your job search by generating a professional resume 
              in seconds. Let our AI do the heavy lifting while you focus 
              on your future career.
            </p>

            {/* Call-to-action Buttons */}
            <div
              className="flex flex-col mb-8 lg:mb-16 space-y-4 
                         sm:flex-row sm:justify-center 
                         sm:space-y-0 sm:space-x-4"
            >
              <a
                href="/dashboard"
                className="inline-flex justify-center items-center py-3 px-5 
                           text-base font-medium text-center text-white 
                           rounded-lg bg-primary hover:bg-primary 
                           focus:ring-4 focus:ring-primary-300 
                           dark:focus:ring-primary-900"
              >
                Get Started
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 
                    011.414 0l6 6a1 1 0 
                    010 1.414l-6 6a1 1 0 
                    01-1.414-1.414L14.586 11H3a1 1 0 
                    110-2h11.586l-4.293-4.293a1 1 0 
                    010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* "How it Works" Section */}
        <section
          className="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center 
                     lg:py-16 lg:px-12"
        >
          <h2 className="font-bold text-3xl">
            How It Works?
          </h2>
          <h3 className="text-md text-gray-500">
            Create a Job-Winning Resume in 3 Simple Steps
          </h3>

          <div
            className="mt-8 grid grid-cols-1 gap-8 
                       md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Step 1 */}
            <a
              className="block rounded-xl border bg-white border-gray-200 p-8 
                         shadow-xl transition hover:border-pink-500/10 
                         hover:shadow-pink-500/10"
              href="#"
            >
              <AtomIcon className="h-8 w-8" />
              <h2 className="mt-4 text-xl font-bold text-black">
                Describe Your Experience
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Provide details about your work history, skills, and achievements. 
                Our AI quickly generates a tailored first draft of your resume 
                based on your unique background.
              </p>
            </a>

            {/* Step 2 */}
            <a
              className="block rounded-xl border bg-white border-gray-200 p-8 
                         shadow-xl transition hover:border-pink-500/10 
                         hover:shadow-pink-500/10"
              href="#"
            >
              <Edit className="h-8 w-8" />
              <h2 className="mt-4 text-xl font-bold text-black">
                Customize & Edit
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Preview different templates and layouts. Update or refine 
                any section until you’re satisfied with the style, tone, 
                and overall presentation.
              </p>
            </a>

            {/* Step 3 */}
            <a
              className="block rounded-xl border bg-white border-gray-200 p-8 
                         shadow-xl transition hover:border-pink-500/10 
                         hover:shadow-pink-500/10"
              href="#"
            >
              <Share2 className="h-8 w-8" />
              <h2 className="mt-4 text-xl font-bold text-black">
                Download & Share
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Export your polished resume in multiple formats, ready 
                to share with employers or recruiters. You can even 
                generate a shareable link for quick access.
              </p>
            </a>
          </div>

          {/* Final CTA */}
          
        </section>
      </div>

      {/* Footer with 'Built by KSHITIJ. PATHAK' */}
      <footer className="py-4 bg-gray-100 text-center dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Built by <strong>KSHITIJ PATHAK</strong>
        </p>
      </footer>
    </div>
  )
}

export default Home
