'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
export function CustomURLS() {
    const [customUrls, setCustomUrls] = useState(null);
    useEffect(() => {
        const customurls = process.env.NEXT_PUBLIC_CUSTOMURL;
        if (customurls) {
            setCustomUrls(JSON.parse(customurls))
        }
    }, []);
    if (!customUrls) return <p>Ładowanie...</p>;
    return (
        <div className="flex gap-1">
            {Object.entries(customUrls).map(([key, value]) => (
                <Link key={key} className={`hover:bg-neutral-800 p-2 rounded-md`} href={value}>{key}</Link> 
            ))}
        </div>
    )
}