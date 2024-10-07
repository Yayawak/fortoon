// import Image from "next/image";
'use client'
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  // Sample Webtoon data
  const webtoons = [
    { id: 1, title: "Webtoon A", description: "Exciting adventures", imageUrl: "/path-to-image-a.jpg" },
    { id: 2, title: "Webtoon B", description: "Mystery and thrills", imageUrl: "/path-to-image-b.jpg" },
    { id: 3, title: "Webtoon C", description: "Love and drama", imageUrl: "/path-to-image-c.jpg" },
  ];

  const categories = [
    { name: "Webtoons", link: "/webtoons", image: "/path-to-webtoon-image.jpg" },
    { name: "Manga", link: "/manga", image: "/path-to-manga-image.jpg" },
    { name: "Comics", link: "/comics", image: "/path-to-comics-image.jpg" },
    { name: "Manhwa", link: "/manhwa", image: "/path-to-manhwa-image.jpg" },
  ];


export default function Home() {

  useEffect(() => {
    fetch("/api")
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      {/* Title Section */}
      <div className="bg-red-200 text-2xl font-bold text-center p-4">
        Webtoon List
      </div>

      {/* Main Content */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        
        {/* Categories Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Explore Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.link}>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  {/* <Image
                    src={category.image}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="object-cover w-full h-40"
                  /> */}
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Webtoon List Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Webtoon List</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {webtoons.map((webtoon) => (
              <div key={webtoon.id} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
                {/* You can uncomment the Image component once you have valid image paths */}
                {/* <Image
                  src={webtoon.imageUrl}
                  alt={webtoon.title}
                  width={200}
                  height={300}
                  className="rounded-lg"
                /> */}
                <h3 className="mt-4 text-xl font-semibold">{webtoon.title}</h3>
                <p className="text-gray-600 mt-2">{webtoon.description}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Next.js
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Templates
        </a>
      </footer>
    </div>
  );
}
