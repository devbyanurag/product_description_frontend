import React, { useState, useRef, useEffect } from 'react';
import styles from "./DashboardHeader.module.css";
import { IoSearchSharp } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { PiSelectionPlus } from "react-icons/pi";
import { FaSort } from "react-icons/fa";

interface DashboardHeaderInterface {
    setSelectionDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    selectionDisabled: boolean;
    showModalNew: () => void
}
const DashboardHeader = ({ selectionDisabled, setSelectionDisabled, showModalNew }: DashboardHeaderInterface) => {
    const [sortDisplay, setSortDisplay] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Alphabetic');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setSortDisplay(false);
        }
    };

    useEffect(() => {
        if (sortDisplay) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortDisplay]);

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerItemContainer}>
                <IoSearchSharp size={20} className={styles.iconMargin} />
                <input type="text" id={styles.searchText} placeholder='Search' />
            </div>
            <div className={styles.headerItemContainer} role="button" tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        showModalNew()
                    }
                }}
                onClick={(e) => {
                    e.preventDefault();
                    showModalNew()

                }}

            >
                <GoPlus size={20} className={styles.iconMargin} />
                <p>New</p>
            </div>
            <div className={styles.headerItemContainer} role="button" tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectionDisabled(!selectionDisabled)
                    }
                }}
                onClick={(e) => {
                    e.preventDefault();
                    setSelectionDisabled(!selectionDisabled)

                }}>
                <PiSelectionPlus size={20} className={styles.iconMargin} />
                <p>{selectionDisabled ? `Enable` : `Disable`} Selection</p>
            </div>
            <div className={styles.headerItemContainer} role="button" tabIndex={0}>
                <MdDelete size={20} className={styles.iconMargin} />
                <p>Delete</p>
            </div>
            <div
                className={styles.headerItemContainer}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSortDisplay(!sortDisplay);
                    }
                }}
                onClick={(e) => {
                    e.preventDefault();
                    setSortDisplay(!sortDisplay);
                }}
            >
                <FaSort size={20} className={styles.iconMargin} />
                <p>Sort</p>
                {sortDisplay && (
                    <div className={styles.dropdown} ref={dropdownRef}>
                        <div className={styles.dropdowntop}></div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedSort('Alphabetic');
                                setSortDisplay(false);
                            }}
                            className={`${selectedSort === 'Alphabetic' && styles.buttonSelected}`}
                        >
                            Alphabetic
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedSort('OtoN');
                                setSortDisplay(false);
                            }}
                            className={`${selectedSort === 'OtoN' && styles.buttonSelected}`}
                        >
                            Older to New
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedSort('NtoO');
                                setSortDisplay(false);
                            }}
                            className={`${selectedSort === 'NtoO' && styles.buttonSelected}`}
                        >
                            New to Older
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;
