
import React from "react";

export function FooterBar() {
    return (
        <footer className="w-full mt-auto py-2">
            <div className="flex justify-center items-center gap-2 text-caption text-secundario font-normal">
                <span>Gobierno de Canarias</span>
                <span className="opacity-50"> | </span>
                <span>CEIP Virgen del Carmen</span>
            </div>
        </footer>
    );
}

export default FooterBar;
