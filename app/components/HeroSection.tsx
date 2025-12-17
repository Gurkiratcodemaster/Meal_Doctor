import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[40vh] lg:h-[50vh] flex items-center w-full px-4 sm:px-8 lg:px-16">

      <Image
        src="/photo1.jpg"
        alt="Hero Background"
        fill
        priority
        className="object-cover brightness-60"
      />


      <div className="relative">
        <div className="text-center text-white translate-y-3 lg:translate-y-15">
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
            Start Your <span className="text-green-400 lg:text-6xl">Meal Doctor App</span>
            <br /> with a Smart Quiz
          </h1>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex justify-center translate-y-6 -translate-x-6 lg:-translate-y-15 w-55 h-55 lg:w-80 lg:h-80 relative">
            <Image
              src="/photo2.png"
              alt="Hero Image"
              fill
              priority
              className="brightness-90"
            />
          </div>
          <div className="flex flex-col text-white items-center justify-center translate-y-3 lg:-translate-y-5">
            <p className="mt-4 text-lg">
              Take the quiz and get AI-powered personalized meal suggestions.
            </p>
            <Link href="/quiz">
              <Button className="mt-3 -ml-8 bg-green-600 hover:bg-green-700 w-40">
                Start Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
