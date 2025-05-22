'use client'
import { useState, useEffect } from "react";

export function ShowSaServers({ onLoaded }) {
    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await fetch(`/api/simpleadmin/systeminfo`);
                const data = await response.json();
                onLoaded(data.servers); // przekaż dane do rodzica
            } catch (ex) {
                console.log(ex);
            }
        };
        fetchServers();
    }, [onLoaded]);

    return null; // nie renderuje nic, tylko przekazuje dane
}
