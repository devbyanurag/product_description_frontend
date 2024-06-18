import { useRef, useState, useEffect } from 'react';
import styles from "./Dashboard.module.css";
import DashboardHeader from './DashboardHeader/DashboardHeader';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { checkStringIfExcedesChar, formatDateTime } from '../../utils/commonFunctions';
import NewItem from './NewItem/NewItem';
import { Dropdown } from 'antd';
import { deleteEdit } from '../../utils/variables';

interface GeneratedDataItem {
    title: string;
    description: string;
    language: string;
    loading: boolean;
    editTitle:boolean;
    editDesc:boolean
}
interface Base64Image {
    name: string;
    data: string;
}
export interface ProductDataInterface {
    productAttributes: {
        productName: string;
        category: string;
        brand: string,
        product_context: string,
        language: string
    };
    selectedImages: Base64Image[],
    timestamp: string
    generatedData: GeneratedDataItem[]
}
const Dashboard = () => {
    const [selectionDisabled, setSelectionDisabled] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isModalOpenNew, setIsModalOpenNew] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [existingData, setExistingData] = useState<ProductDataInterface[]>([]);
    const showModalNew = () => {
        setSelectedIndex(null);
        setIsModalOpenNew(true);
        setTimeout(() => {
            if (closeButtonRef.current) {
                closeButtonRef.current.focus();
            }
        }, 0);
    };

    const showModalEdit = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpenNew(true);
        setTimeout(() => {
            if (closeButtonRef.current) {
                closeButtonRef.current.focus();
            }
        }, 0);
    };
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('productData') || '[]');
        setExistingData(data);
    }, [isModalOpenNew]);

    const handledeleteEdit = (index: number) => {
        const newData = [...existingData];
        newData.splice(index, 1); // Remove the item at the specified index
        setExistingData(newData);
        localStorage.setItem('productData', JSON.stringify(newData)); // Update localStorage
    };

    return (
        <div className={styles.container}>
            <DashboardHeader setSelectionDisabled={setSelectionDisabled} selectionDisabled={selectionDisabled} showModalNew={showModalNew} />

            <div className={styles.productListContainer}>


                {existingData.map((item, index) => (
                    <div className={styles.productItemContainerOuter} key={index}>
                        {!selectionDisabled && <input type="checkbox" />}
                        <div className={styles.productItemContainer} >
                            <img src={item.selectedImages[0].data} alt="image" />
                            <div className={styles.productItemDetailsContainer} onClick={() => showModalEdit(index)}>
                                {/* <p>123234</p> */}
                                <p>{checkStringIfExcedesChar(item.productAttributes.productName, 30)}</p>
                                <p>{item.productAttributes.category}</p>
                                <p>{item.productAttributes.brand}</p>
                                <p>{formatDateTime(item.timestamp)}</p>
                            </div>
                            <Dropdown
                                menu={{ items: deleteEdit, onClick: () => handledeleteEdit(index) }}
                                className={styles.inputValue}
                                overlayStyle={{ borderRadius: 0 }}
                                trigger={['click']}
                            >
                                <PiDotsThreeOutlineVerticalFill size={20} className={styles.editItem3dot} />
                            </Dropdown>
                        </div>


                    </div>
                ))}

            </div>

            {isModalOpenNew && <NewItem
                setIsModalOpenNew={setIsModalOpenNew}
                closeButtonRef={closeButtonRef}
                selectedItem={selectedIndex !== null ? existingData[selectedIndex] : undefined}


            />}
        </div>
    );
};

export default Dashboard;
