import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search orders..." }) => {
    return (
        <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
                type="text"
                className="input-field search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            
            <style>{`
                .search-container {
                    position: relative;
                    width: 100%;
                    max-width: 300px;
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }
                .search-input {
                    padding-left: 38px;
                }
            `}</style>
        </div>
    );
};

export default SearchBar;
