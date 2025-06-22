"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LanguagesIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";

const available_locales = [
  {
    title: "English",
    code: "en",
    countryCode: "GB",
  },
  {
    title: "Français",
    code: "fr",
    countryCode: "FR",
  },
  {
    title: "Español",
    code: "es",
    countryCode: "ES",
  },
  {
    title: "Deutsch",
    code: "de",
    countryCode: "DE",
  },
  {
    title: "Italiano",
    code: "it",
    countryCode: "IT",
  },
];

export default function LangSelect() {
  const pathname = usePathname();
  const router = useRouter();

  function handleChangeLocale(newLocale: string) {
    router.push(pathname.replace(/\/[a-z]{2}/, `/${newLocale}`));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <LanguagesIcon className="h-[1.1rem] w-[1.1rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {available_locales.map((locale) => (
          <DropdownMenuItem
            onClick={() => handleChangeLocale(locale.code)}
            key={locale.title}
          >
            <ReactCountryFlag
              countryCode={locale.countryCode}
              svg
              className="mr-2 flag-rounded"
              style={{
                width: '1.2em',
                height: '1.2em',
              }}
            />
            {locale.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
