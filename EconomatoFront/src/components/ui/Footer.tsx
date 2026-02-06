
import React from "react";

export function FooterBar() {
    return (
        <footer className="w-full py-1 mt-auto">
            <div className="flex justify-center items-center gap-4 text-gray-500 text-sm font-small tracking-widest">
                <p>Gobierno de Canarias</p>
                <p className="text-gray-500">|</p>
                <p>CEIP Virgen del Carmen</p>
            </div>
        </footer>
    );
}

export default FooterBar;
