// import React from 'react';
// import Sidebar from './Sidebar';

// const Layout = ({ children }) => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="fixed left-0 top-0 h-full">
//         <Sidebar />
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex flex-col w-full ml-60">
//         {/* Header */}
//         <header className="fixed top-0 right-0 left-60 bg-white shadow-md z-10">
//           <div className="flex justify-between items-center px-6 py-4">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold text-gray-800">Communi Care</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
//                 <button className="p-2 text-gray-600 hover:text-gray-800">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <img src="/api/placeholder/32/32" alt="User avatar" className="w-8 h-8 rounded-full" />
//                 <span className="text-gray-700">John Doe</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="flex-grow mt-16 p-6">
//           {children}
//         </main>

//         {/* Footer */}
//         <footer className="bg-white shadow-md mt-auto">
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex justify-between items-center">
//               <p className="text-gray-600">© 2024 Communi Care. All rights reserved.</p>
//               <div className="flex space-x-4">
//                 <a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
//                 <a href="#" className="text-gray-600 hover:text-gray-800">Terms of Service</a>
//                 <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Layout;