import type { Metadata } from "next";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { Navbar } from "@/components/navbar";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import { getDictionary, LangProps } from "@/lib/dictionaries";
import { ClientDictionary } from "@/components/contexts/dictionary-provider";
import { locales } from "@/lib/locale";
import "@/styles/globals.css";

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});

export async function generateMetadata(params: LangProps): Promise<Metadata> {
  const { lang } = await params.params;
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.title,
    metadataBase: new URL("https://polaris-docs.vercel.app/"),
    description: dict.metadata.description,
    openGraph: {
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Polaris Systems Documentation",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<
  {
    children: React.ReactNode;
  } & LangProps
>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ClientDictionary dict={dict}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar dict={dict} />
            <main className="sm:container mx-auto w-[90vw] flex-1 scroll-smooth">
              {children}
            </main>
            <Footer dict={dict} />
          </ThemeProvider>
        </ClientDictionary>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}
