'use client';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 py-4 px-6 flex justify-between items-center shadow-md bg-white z-50">
      <div className="text-xl font-bold">
        Your Logo
      </div>
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition-colors">
          Log in
        </button>
        <button className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
          Sign up
        </button>
      </div>
    </header>
  );
};

export default Header; 