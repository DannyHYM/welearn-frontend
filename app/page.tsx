import Header from '../components/Header';

export default function Home() {
  return (
    <main>
      <Header />
      <div 
        className="min-h-screen pt-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/landing-page.png")'
        }}
      >
        <div className="container mx-auto px-4 pt-16 flex items-center justify-end min-h-screen">
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