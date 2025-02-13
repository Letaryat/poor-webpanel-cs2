"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { Dot } from 'lucide-react';

export default function BreadCrumb() {
  const path = usePathname();
  let patharray = path.split("/").filter((path) => path);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {patharray.length > 0}
        {patharray.map((link, index) => {
          let href = `/${patharray.slice(0, index + 1).join("/")}`;
          return (
            <Fragment key={index}>
            <BreadcrumbSeparator>
                <Dot />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>{link}</BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
