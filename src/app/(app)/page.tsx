'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-5xl text-center font-bold">Mr. Anonymous</h1>
        <p className="mt-3 md:mt-4 text-base md:text-xl font-mono"> Your voice, your thoughts, your anonymity.</p>
      </section>

      <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-3xl font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
