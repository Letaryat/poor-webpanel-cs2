'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
export default function STPagination({ totaldata }) {

    //rwd:
    const [windowWidth, setWindowWidth] = useState(1024);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },[])

    const maxVisiblePages = windowWidth < 768 ? 3 : 7;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const playersPerPage = 20;

    const params = new URLSearchParams(searchParams.toString());

    const currentPage = parseInt(params.get("page")) || 1;
    const totalPages = Math.ceil(totaldata / playersPerPage) || 1;

    const half = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const paramPage = (value) => {
        params.set("page", value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex justify-center gap-2 mt-4">
            <button
                onClick={() => paramPage(1)}
                className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
            >
                First
            </button>

            <div className="flex gap-2">
                {pagesToShow.map((page) => (
                    <button
                        key={page}
                        onClick={() => paramPage(page)}
                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500' : 'bg-neutral-800'}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => paramPage(totalPages)}
                className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
            >
                Last
            </button>
        </div>
    );
}
