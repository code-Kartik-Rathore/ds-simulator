import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const features = [
  {
    title: "Basic Data Structures",
    description: "Master fundamental data structures including linked lists, stacks, and queues with interactive step-by-step visualizations.",
    image: "/linked-list-preview.png"
  },
  {
    title: "Tree Data Structures",
    description: "Learn binary search trees, AVL trees with auto-balancing, and heap operations through visual demonstrations.",
    image: "/tree-preview.png"
  },
  {
    title: "Infix to Postfix Conversion",
    description: "Understand expression conversion using stacks. Watch how infix expressions are transformed into postfix notation.",
    image: "/infix-postfix-preview.png"
  },
  {
    title: "Message Queue System",
    description: "Explore producer-consumer scenarios with message queues. Visualize message flow and queue operations.",
    image: "/message-queue-preview.png"
  },
  {
    title: "Polynomial Operations",
    description: "See polynomial multiplication in action using linked list representation. Follow term-by-term multiplication steps.",
    image: "/polynomial-preview.png"
  },
  {
    title: "Visual Analysis Tools",
    description: "Analyze performance characteristics and structural properties of each data structure with built-in analysis tools.",
    image: "/analysis-preview.png"
  }
];

export const Features = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>Features</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Interactive Learning Tools
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
              Learn data structures and their applications through hands-on visualizations and real-world examples.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);