"use client";

import { MoveRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => (
  <div className="relative w-full py-24 lg:py-44 overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-background">
    <div className="absolute inset-0">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className="[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
      />
    </div>

    <div className="container mx-auto relative">
      <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
        <div className="flex gap-6 flex-col relative">
          <div className="absolute left-0 top-0 h-full w-2 rounded-full bg-gradient-to-b from-accent to-primary/70 shadow-lg hidden sm:block" />
          <div className="flex gap-4 flex-col pl-4 sm:pl-8">
            <h1 className="text-5xl md:text-7xl max-w-lg tracking-tight text-left font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-lg">
              DS Simulator
            </h1>
            <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
              Interactive tool for learning and understanding data structures through visual animations and step-by-step operations.
            </p>
          </div>
          <div className="flex flex-row gap-4 pl-4 sm:pl-8">
            <Link href="https://github.com/yourusername/ds-visualizer">
              <Button className="gap-4 border-accent text-accent-foreground hover:bg-accent/20 hover:border-primary transition-all shadow-md" variant="outline">
                View on GitHub <Github className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/visualizer">
              <RainbowButton className="w-full shadow-xl">
                Visualizer <MoveRight className="hidden sm:block w-4 h-4" />
              </RainbowButton>
            </Link>
          </div>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl">
          <Image
            src="/ds-bst.png"
            alt="Visualizer Preview"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>
      </div>
    </div>
  </div>
); 