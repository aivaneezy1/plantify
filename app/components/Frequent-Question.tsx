import React from 'react'
import Link from 'next/link'
const FrequentQuestionComponent = () => {
  return (
      <div className="md:mt-42 mt-10 ml-10 mr-10 px-6 py-8 ">
        <h2 className="text-white font-bold text-3xl mb-8 whitespace-nowrap">
          Frequently Asked Questions
        </h2>

        <div className="space-y-12 text-left ml-5 mr-5">
          <div className="max-w-lg">
            <h3 className="text-white font-semibold text-2xl mb-2">
              What is Plantify?
            </h3>
            <p className="text-gray-200">
              Bring your imagination to life! Plantify lets you transform your
              ideas and drawings into stunning images effortlessly. Powered by
              the StableDiffusion and Stability AI APIs.
            </p>
          </div>

          <div className="max-w-lg">
            <h3 className="text-white font-semibold text-2xl mb-2">
              How do I create AI-generated art with Plantify?
            </h3>
            <ol className="list-decimal list-inside text-gray-200">
              <li>Log in to your <Link href="/sign-in" className='cursor-pointer underline'>Plantify account</Link>.</li>
              <li>Describe your idea, or draw your ideas.</li>
              <li>Click <span className='text-blue-500 font-semibold'>"Generate"</span> to create your images.</li>
              <li>Download and share your creations with the world.</li>
            </ol>
          </div>

          <div className="max-w-lg">
            <h3 className="text-white font-semibold text-2xl mb-2">
              Is Plantify AI free?
            </h3>
            <p className="text-gray-200">
              Yes! New accounts receive 100 bits for free, and each image
              generation costs 10 bits. Once your free bits are used, you can
              purchase additional bits as needed. The cost is 1 euro for 50
              bits.
            </p>
          </div>

          <div className="max-w-lg">
            <h3 className="text-white font-semibold text-2xl mb-2">
              Where can I view my images?
            </h3>
            <p className="text-gray-200">
              If you are logged in you can access your generated images by visiting the dashboard
              under "Recent Requests." From there, you can download and save
              your images. Please note, images are stored for 90 days, so be
              sure to save them locally before they're deleted.
            </p>
          </div>
        </div>
      </div>
  )
}

export default FrequentQuestionComponent
