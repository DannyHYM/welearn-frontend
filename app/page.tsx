"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm z-50">
        <h1 className="text-xl font-bold">WeLearn</h1>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </header>

      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/landing-page.png")'
        }}
      >
        <div className="container mx-auto px-4 pt-24 flex items-center justify-end min-h-screen">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-xl">
            <h1 className="text-5xl font-semibold mb-6">
              Where Ideas Grow Stronger Together
            </h1>
            <p className="text-gray-700 text-xl mb-8">
              Gather insights, share discoveries, and see what your team has learned. Nest's AI crafts a clear, cross-discipline summary to deepen understanding and amplify collective growth.
            </p>
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-black"
              />
              <button className="px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 