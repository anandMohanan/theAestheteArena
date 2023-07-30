"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Community, Prisma } from "@prisma/client";
import { CommandEmpty } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

export const SearchBar = () => {
  const [input, setInput] = useState<string>("");

  const request = debounce(async () => {
    await refetch();
  }, 300);
  const debounceRequest = useCallback(() => {
    request();
  }, []);
  const {
    data: queryResult,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Community & {
        _count: Prisma.CommunityCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const router = useRouter();

  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setInput("");
  });
  const pathname = usePathname();
  useEffect(() => {
    setInput("");
  }, [pathname]);
  return (
    <Command
      ref={commandRef}
      className={`relative rounded-lg  mx-w-lg z-50 overflow-visible bg-deep-champagne`}
    >
      <CommandInput
        isLoading={isFetching}
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="search communities"
      />

      {input.length > 0 ? (
        <CommandList className="absolute bg-deep-champagne top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResult?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResult?.map((community) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/w/community/${e}`);
                    router.refresh();
                  }}
                  key={community.id}
                  value={community.name}
                  className="hover:bg-primary-colour"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/w/community/${community.name}`}>
                    w/{community.name}
                  </a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};
