'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function STPagination({ totaldata }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const playersPerPage = 20;

    const params = new URLSearchParams(searchParams.toString());

    const currentPage = parseInt(params.get("page")) || 1;

    const totalPages = Math.ceil(totaldata / playersPerPage) || 1;
    const startPage = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
    const endPage = Math.min(totalPages, startPage + 6);
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
