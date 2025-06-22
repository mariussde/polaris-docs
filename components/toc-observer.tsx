"use client";

import { getDocsTocs } from "@/lib/markdown";
import clsx from "clsx";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type Props = { data: Awaited<ReturnType<typeof getDocsTocs>> };

export default function TocObserver({ data }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const sectionStates = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Update the state of all observed sections
      entries.forEach((entry) => {
        sectionStates.current.set(entry.target.id, entry.isIntersecting);
      });

      // Check if user has scrolled to the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      
      let newActiveId: string | null = null;
      
      // If at the bottom of the page, activate the last section
      if (isAtBottom && data.length > 0) {
        newActiveId = data[data.length - 1].href.slice(1);
      } else {
        // Find the first intersecting section from top to bottom
        for (const item of data) {
          const sectionId = item.href.slice(1);
          if (sectionStates.current.get(sectionId)) {
            newActiveId = sectionId;
            break;
          }
        }

        // If no section is intersecting, find the closest one above the viewport
        if (!newActiveId) {
          const viewportTop = window.scrollY;
          let closestSection: string | null = null;
          let closestDistance = Infinity;

          for (const item of data) {
            const element = document.getElementById(item.href.slice(1));
            if (element) {
              const elementTop = element.offsetTop;
              const distance = Math.abs(viewportTop - elementTop);
              
              if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = item.href.slice(1);
              }
            }
          }
          
          newActiveId = closestSection;
        }
      }

      if (newActiveId && newActiveId !== activeId) {
        setActiveId(newActiveId);
      }
    };

    const handleScroll = () => {
      // Trigger intersection check on scroll to handle bottom detection
      if (observer.current) {
        const entries: IntersectionObserverEntry[] = [];
        data.forEach((item) => {
          const element = document.getElementById(item.href.slice(1));
          if (element) {
            const rect = element.getBoundingClientRect();
            const isIntersecting = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
            entries.push({
              target: element,
              isIntersecting,
              intersectionRatio: isIntersecting ? 1 : 0,
              boundingClientRect: rect,
              intersectionRect: rect,
              rootBounds: null,
              time: Date.now()
            } as IntersectionObserverEntry);
          }
        });
        handleIntersect(entries);
      }
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-5% 0px -5% 0px", // Reduced margins for better detection on short pages
      threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1.0], // More thresholds for smoother transitions
    });

    const elements = data.map((item) =>
      document.getElementById(item.href.slice(1))
    );

    elements.forEach((el) => {
      if (el && observer.current) {
        observer.current.observe(el);
      }
    });

    // Add scroll listener for bottom detection
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      if (observer.current) {
        elements.forEach((el) => {
          if (el) {
            observer.current!.unobserve(el);
          }
        });
      }
      window.removeEventListener('scroll', handleScroll);
      sectionStates.current.clear();
    };
  }, [data, activeId]);

  return (
    <div className="flex flex-col gap-2.5 text-sm dark:text-stone-300/85 text-stone-800 ml-0.5">
      {data.map(({ href, level, text }, index) => {
        return (
          <Link
            key={href + text + level + index}
            href={href}
            className={clsx({
              "pl-0": level === 2,
              "pl-4": level === 3,
              "pl-8": level === 4,
              "dark:font-medium font-semibold !text-primary":
                activeId === href.slice(1),
            })}
          >
            {text}
          </Link>
        );
      })}
    </div>
  );
}
