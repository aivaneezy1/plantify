import React from 'react'
import Link from 'next/link'

const FrequentQuestionComponent = () => {
  return (
    <div className="md:mt-42 mt-10 "> {/* Increased px-6 to px-8 for more padding */}
      <h2 className="text-white font-bold text-4xl mb-8"> {/* Increased text-3xl to text-4xl */}
         Frequent Asked Questions
      </h2>

      <div className="space-y-12 text-left px-6"> {/* Replaced ml-5 mr-5 with px-6 for consistent padding */}
        <div className="ml-5 mr-5">
          <h3 className="text-white font-semibold text-3xl mb-2 "> {/* Increased text-2xl to text-3xl */}
            What is Plantify?
          </h3>
          <p className="text-gray-200 text-lg"> {/* Added text-lg to increase font size */}
            Bring your imagination to life! Plantify lets you transform your
            ideas and drawings into stunning images effortlessly. Powered by
            the StableDiffusion and Stability AI APIs.
          </p>
        </div>

        <div className="ml-5 mr-5">
          <h3 className="text-white font-semibold text-3xl mb-2 "> {/* Increased text-2xl to text-3xl */}
            How do i generate an image?
          </h3>
          <ol className="list-decimal list-inside text-gray-200 text-lg"> {/* Added text-lg to increase font size */}
            <li>Log in to your <Link href="/sign-in" className='cursor-pointer underline'>Plantify account</Link>.</li>
            <li>Describe your idea, or draw your ideas.</li>
            <li>Click <span className='text-blue-500 font-semibold'>"Generate"</span> to create your images.</li>
            <li>Download and share your creations with the world.</li>
          </ol>
        </div>

        <div className=" ml-5 mr-5">
          <h3 className="text-white font-semibold text-3xl mb-2"> {/* Increased text-2xl to text-3xl */}
            Is Plantify AI free?
          </h3>
          <p className="text-gray-200 text-lg"> {/* Added text-lg to increase font size */}
            Yes! New accounts receive 100 bits for free, and each image
            generation costs 10 bits. Once your free bits are used, you can
            purchase additional bits as needed. The cost is 1 euro for 50
            bits.
          </p>
        </div>

        <div className=" ml-5 mr-5">
          <h3 className="text-white font-semibold text-3xl mb-2"> {/* Increased text-2xl to text-3xl */}
            Where can I view my images?
          </h3>
          <p className="text-gray-200 text-lg"> {/* Added text-lg to increase font size */}
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
