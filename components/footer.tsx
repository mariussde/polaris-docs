import Link from "next/link";
import { Dictionary } from "@/lib/dictionaries";
import Image from "next/image";
import logoLight from "@/public/logo-light.png";
import logoDark from "@/public/logo-dark.png";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t w-full mt-auto">
      <div className="container flex items-center sm:justify-between justify-center sm:gap-0 gap-4 py-4 text-muted-foreground text-sm flex-wrap max-sm:px-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Image
              src={logoLight}
              width={22}
              height={22}
              alt="logo"
              className="dark:hidden"
            />
            <Image
              src={logoDark}
              width={22}
              height={22}
              alt="logo"
              className="hidden dark:block"
            />
          </div>
          <p className="text-center">
            {dict.footer.source_code_available}{" "}
            <Link
              className="px-1 underline underline-offset-2"
              href="https://github.com/mariussde/polaris-docs"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}