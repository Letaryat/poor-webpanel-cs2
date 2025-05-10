'use client'
import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"

export default function STPagination({ totaldata }) {
    const [currentPage, setCurrentPage] = useState(1);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const playersPerPage = 20;

    const params = new URLSearchParams(searchParams.toString());

    //Pagination:
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        paramPage(currentPage + 1);
    }

    const prevPage = () => {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
        paramPage(newPage);
    }

    const paramPage = (value) => {
        params.set("page", value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };


    const totalPages = Math.ceil(totaldata / 10) || 1;
    const startPage = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
    const endPage = Math.min(totalPages, startPage + 6);
    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="flex justify-center gap-8 mt-4">
            <div className="flex gap-1">
                <button
                    onClick={() => {
                        setCurrentPage(1)
                        paramPage(1)
                    }}
                    className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                >
                    First
                </button>
            </div>

            <div className="flex gap-2">
                {pagesToShow.map((page) => (
                    <button
                        key={page}
                        onClick={() => {
                            setCurrentPage(page)
                            paramPage(page)
                        }
                        }
                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500' : 'bg-neutral-800'}`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <div className="flex gap-1">
                <button
                    onClick={() => {
                        setCurrentPage(totalPages);
                        paramPage(totalPages);
                    }}
                    className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === totalPages}
                >
                    Last
                </button>
            </div>
        </div>
    )
}