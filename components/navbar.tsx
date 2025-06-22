import { ModeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Search from "./search";
import { SheetLeftbar } from "./leftbar";
import { page_routes } from "@/lib/routes-config";
import { SheetClose } from "@/components/ui/sheet";
import LangSelect from "./lang-select";
import { Dictionary } from "@/lib/dictionaries";
import LocalizedLink from "./localized-link";
import Image from "next/image";
import logoLight from "@/public/logo-light.png";
import logoDark from "@/public/logo-dark.png";

export const NAVLINKS = [
  {
    title: "documentation",
    href: `/docs${page_routes[0].href}`,
    absolute: true,
  },
  {
    title: "blog",
    href: "/blog",
  },
];

export function Navbar({ dict }: { dict: Dictionary }) {
  return (
    <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center justify-between md:gap-2">
        {/* Left Section */}
        <div className="flex items-center gap-5 flex-1 justify-start">
          <SheetLeftbar dict={dict} />
          <div className="flex items-center gap-6">
            <div className="sm:flex hidden">
              <Logo />
            </div>
            <div className="lg:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
              <NavMenu dict={dict} />
            </div>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex justify-center max-w-md mx-4">
          <Search dict={dict} />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="flex items-center gap-2">
            <div className="flex ml-2.5 sm:ml-0">
              <LangSelect />
              <Link
                href="https://github.com/mariussde/polaris-docs"
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
              </Link>
              <ModeToggle/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <LocalizedLink href="/" className="flex items-center gap-2.5">
      <Image
        src={logoLight}
        width={28}
        height={28}
        alt="logo"
        className="dark:hidden"
      />
      <Image
        src={logoDark}
        width={28}
        height={28}
        alt="logo"
        className="hidden dark:block"
      />
      <h2 className="text-md font-bold font-code">PolarisDocs</h2>
    </LocalizedLink>
  );
}

export function NavMenu({
  isSheet = false,
  dict,
}: {
  isSheet?: boolean;
  dict: Dictionary;
}) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <LocalizedLink
            key={item.title + item.href}
            className="flex items-center gap-1 dark:text-stone-300/85 text-stone-800"
            activeClassName="!text-primary dark:font-medium font-semibold"
            href={item.href}
            absolute={item.absolute}
          >
            {dict.navbar.links[item.title as keyof typeof dict.navbar.links]}
          </LocalizedLink>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
