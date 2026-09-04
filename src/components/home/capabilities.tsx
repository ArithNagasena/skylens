import { Camera, FileText, Film, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/primitives";

const workflowSteps = [
  {
    icon: FileText,
    title: "1. Quote & Approval",
    body: "Provide your project details and receive a comprehensive quote. Once accepted, our team takes over the entire process.",
  },
  {
    icon: ShieldCheck,
    title: "2. Clearances Handled",
    body: "We secure all necessary permissions—from CAASL, Air Force, and Ministry of Defence to local security clearances. You never touch aviation paperwork.",
  },
  {
    icon: Camera,
    title: "3. Execution & Capture",
    body: "Our expert crew executes the shoot using top-tier drones, capturing the remarkably smooth, high-end cinematic footage your project demands.",
  },
  {
    icon: Film,
    title: "4. Edit & Delivery",
    body: "Clips are meticulously edited into a stunning final product and delivered straight to your hands, ready for immediate use.",
  },
];

export function Capabilities() {
  return (
    <Section id="capabilities" tight className="border-y border-ink/[0.09] bg-obsidian">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-balance text-3xl leading-[1.06] sm:text-4xl md:text-[2.9rem]">
              Anyone can put a camera in the sky.{" "}
              <span className="text-ink-dim">
                The value is in what lands on your desk afterwards.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              <p className="text-body leading-relaxed text-ink-muted md:text-lead">
                With years of experience, Sky Lens has evolved from shooting weekend property
                listings into a premier aerial media operation.
              </p>
              <p className="text-body leading-relaxed text-ink-muted md:text-lead">
                Our fleet features the DJI Air 3S for smooth, cinematic footage, and the heavy-lift
                DJI Agras T50 for specialised work like aerial flower drops. Whatever the mission,
                we plan backwards from the exact results you need.
              </p>
            </div>
          </Reveal>
        </div>

        <RevealGroup className="card elev-1 mt-12 grid gap-px overflow-hidden rounded-2xl bg-ink/[0.1] sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((p) => (
            <RevealItem
              key={p.title}
              className="group relative flex flex-col gap-4 bg-raised px-6 py-8 transition-colors duration-500 hover:bg-obsidian"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-signal-soft text-signal transition-transform duration-500 group-hover:-translate-y-0.5">
                <p.icon className="size-5" strokeWidth={1.6} />
              </span>
              <h3 className="text-lead tracking-tight">{p.title}</h3>
              <p className="text-body leading-relaxed text-ink-muted">{p.body}</p>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-signal to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
