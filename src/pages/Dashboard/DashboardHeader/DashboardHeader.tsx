import React, { useState, useRef, useEffect } from 'react';
import styles from "./DashboardHeader.module.css";
import { IoSearchSharp } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { PiSelectionPlus } from "react-icons/pi";
import { FaSort } from "react-icons/fa";
import { Dropdown, MenuProps } from 'antd';
import { sortValues } from '../../../utils/variables';

interface DashboardHeaderInterface {
    setSelectionDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    selectionDisabled: boolean;
    showModalNew: () => void
}
const DashboardHeader = ({ selectionDisabled, setSelectionDisabled, showModalNew }: DashboardHeaderInterface) => {
    const [sortDisplay, setSortDisplay] = useState(false);
    const [selectedSort, setSelectedSort] = useState(1);
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

        console.log(selectedSort)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortDisplay]);

    const handleTranslateLanguageChange: MenuProps['onClick'] = (e) => {
        setSelectedSort(parseInt(e.key))

    };

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
            <Dropdown
                menu={{ items: sortValues, onClick: handleTranslateLanguageChange }}
                overlayStyle={{ borderRadius: 0 }}
                trigger={['click']}
            >
                <div
                    className={styles.headerItemContainer}
                    role="button"
                    tabIndex={0}

                >

                    <FaSort size={20} className={styles.iconMargin} />
                    <p>Sort</p>


                </div>
            </Dropdown>

        </div>
    );
};

export default DashboardHeader;
