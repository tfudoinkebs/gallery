import { Button } from "@/components/ui/button";
import { FaGithub, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { ModeToggle } from "./ui/toggle-mode";

const socialLinks = [
  {
    icon: FaGithub,
    href: "https://github.com/tfudoinkebs",
    label: "GitHub",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/kevinspovvv/",
    label: "Instagram",
  },
];

export default function Header() {
  return (
    <div className="w-full text-center my-8">
      <h1 className="md:text-7xl px-2 text-4xl font-black">
        Us, But Make It Art
      </h1>
      <p className="py-4 px-2 text-xs md:text-sm">
        A gallery of <i>our mess</i>—the laughs, the love, the chaos, and all
        the little moments that make us <i>us</i>.
      </p>
      <div className="flex items-center justify-center gap-2">
        {socialLinks.map((social) => (
          <Button key={social.label} variant="outline" size="icon" asChild>
            <Link
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              <social.icon className="h-5 w-5" />
            </Link>
          </Button>
        ))}
        <ModeToggle />
      </div>
    </div>
  );
}
