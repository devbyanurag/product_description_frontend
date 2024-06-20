import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import styles from './NewItem.module.css';
import { MdClose, MdDelete, MdGTranslate, MdOutlineSaveAs } from 'react-icons/md';
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { MenuProps, Modal, Space, Tabs, message } from 'antd';
import { Dropdown } from 'antd';
import { languageOptions, categoryOptions } from '../../../utils/variables'

import { RiAiGenerate, RiEditLine, RiLoader4Line, RiShareForward2Line, RiAddLine } from "react-icons/ri";
import apiInstance from '../../../utils/api';
import { base64ToFile, fileToBase64 } from '../../../utils/commonFunctions';
import { ProductDataInterface } from '../Dashboard';

interface NewItemProps {
    setIsModalOpenNew: React.Dispatch<React.SetStateAction<boolean>>;
    closeButtonRef: React.RefObject<HTMLButtonElement>;
    selectedItem?: ProductDataInterface;
}

const NewItem: React.FC<NewItemProps> = ({
    setIsModalOpenNew,
    closeButtonRef,
    selectedItem

}) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newTranslateLanguage, setNewTranslateLanguage] = useState('English')

    const initialGeneratedData = [
        {
            title: '',
            description: '',
            language: '',
            loading: false,
            editTitle: false,
            editDesc: false,
            title_tag: '',
            meta_description_tag: '',
            keywords_tag: '',
            header_tag: '',
        }
    ];

    useEffect(() => {
        if (selectedItem) {
            setProductAttributes({
                productName: selectedItem.productAttributes.productName || '',
                brand: selectedItem.productAttributes.brand || '',
                category: selectedItem.productAttributes.category || '',
                language: selectedItem.productAttributes.language || 'English',
                product_context: selectedItem.productAttributes.product_context || ''
            });
            setSelectedImages(selectedItem.selectedImages.map(image => {
                const file = base64ToFile(image.data, image.name);
                return file;
            }) || []);
            setGeneratedData(selectedItem.generatedData || initialGeneratedData);
        }
    }, [selectedItem]);

    const [generatedData, setGeneratedData] = useState(initialGeneratedData);


    const [productAttributes, setProductAttributes] = useState({
        productName: '',
        brand: '',
        category: '',
        language: 'English',
        product_context: ''
    });
    const handleAddData = async (genDesc: string, genTitle: string) => {
        const newData = {
            title: '',
            description: '',
            language: newTranslateLanguage,
            loading: false,
            editTitle: false,
            editDesc: false,
            title_tag: '',
            meta_description_tag: '',
            keywords_tag: '',
            header_tag: '',

        };

        const updatedData = [...generatedData];

        updatedData.splice(0, 0, newData);

        setGeneratedData(updatedData);
        const formData = new FormData();

        formData.append('title', genTitle);
        formData.append('description', genDesc);
        formData.append('language', newTranslateLanguage);

        try {
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].loading = true;
                return updatedData;
            });
            const response = await apiInstance.post(`/product/product-content-generator/openai/translate`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const { title, description, language } = response.data.body;
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                if (title !== "") {
                    updatedData[0].title = title;
                }
                if (description !== "") {
                    updatedData[0].description = description;
                }
                if (language !== "") {
                    updatedData[0].language = language;
                }
                return updatedData;
            });

        } catch (e) {
            console.log(e)
            error("somthing went wrong. Try again")
        }
        finally {
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].loading = false;
                return updatedData;
            });
        }
    };

    const handleProductAttributesChange = (name: string, value: string) => {
        setProductAttributes({
            ...productAttributes,
            [name]: value
        });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setSelectedImages(selectedFiles);
        setCurrentIndex(0);
    };

    const handleAddMoreFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setSelectedImages(prevImages => [...prevImages, ...Array.from(files)]);
        }
    };
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleDelete = (index: number) => {
        const updatedFiles = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedFiles);
        setCurrentIndex((prevIndex) => (prevIndex >= updatedFiles.length ? updatedFiles.length - 1 : prevIndex));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedImages.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1
        );
    };
    const handleCategoryChange: MenuProps['onClick'] = (e) => {
        if (categoryOptions) {
            const selectedKey = e.key;
            const selectedCategory = categoryOptions.find(option => option.key === selectedKey);

            if (selectedCategory) {
                handleProductAttributesChange('category', selectedCategory.label)
            } else {
                console.log('Category not found');
            }
        }
    };
    const handleLanguageChange: MenuProps['onClick'] = (e) => {
        if (languageOptions) {
            const selectedKey = e.key;
            const selectedLanguage = languageOptions.find(option => option.key === selectedKey);

            if (selectedLanguage) {
                handleProductAttributesChange('language', selectedLanguage.label)
            } else {
                console.log('language not found');
            }
        }
    };
    const handleTranslateLanguageChange: MenuProps['onClick'] = (e) => {
        if (languageOptions) {
            const selectedKey = e.key;
            const selectedLanguage = languageOptions.find(option => option.key === selectedKey);
            if (selectedLanguage) {
                setNewTranslateLanguage(selectedLanguage.label)
            } else {
                console.log('language not found');
            }
        }
    };



    const [isModalOpen, setIsModalOpen] = useState(false);


    const error = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };
    const success = (message: string) => {
        messageApi.open({
            type: 'success',
            content: message,
        });
    };
    const handleGenerate = async (genType: 'title' | 'desc' | 'both') => {
        if (selectedImages.length <= 0 && productAttributes.product_context === "") {
            error('Please Enter Product images or Product Details')
            return;
        }
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append(`files`, image);
        });
        formData.append('title', genType === 'title' || genType === 'both' ? 'true' : 'false');
        formData.append('description', genType === 'desc' || genType === 'both' ? 'true' : 'false');
        formData.append('language', productAttributes.language);
        if (productAttributes.category !== "") {
            formData.append('category', productAttributes.category);
        }
        if (productAttributes.brand !== "") {
            formData.append('brand', productAttributes.brand);
        }
        if (productAttributes.product_context !== "") {
            formData.append('product_context', productAttributes.product_context);
        }
        try {
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].loading = true;
                return updatedData;
            });
            const response = await apiInstance.post(`/product/product-content-generator/openai/threading`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const { title, description, language } = response.data.body;
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                if (title !== "") {
                    updatedData[0].title = title;
                }
                if (description !== "") {
                    updatedData[0].description = description;
                }
                if (language !== "") {
                    updatedData[0].language = language;
                }
                return updatedData;
            });

        } catch (e) {
            error("somthing went wrong. Try again")
        }
        finally {
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].loading = false;
                return updatedData;
            });
        }
    }
    const saveToLocalStorage = async () => {
        const existingData = JSON.parse(localStorage.getItem('productData') || '[]');
        const base64Images = await Promise.all(selectedImages.map(async (file) => {
            const base64String = await fileToBase64(file);
            return { name: file.name, data: base64String };
        }));
        const newData = {
            id: Date.now(), // Use timestamp as ID
            timestamp: new Date().toISOString(), // Use current date/time as timestamp
            selectedImages: base64Images,
            generatedData,
            productAttributes,
            currentIndex,
            newTranslateLanguage,
        };
        const updatedData = [...existingData, newData];
        localStorage.setItem('productData', JSON.stringify(updatedData));
        setIsModalOpenNew(false)
        success('Saved Successfully')
    };

    // const handleDeleteGen = (indexToDelete: number) => {
    //     if (generatedData.length > 1) {
    //         const updatedData = generatedData.filter((_, index) => index !== indexToDelete);
    //         setGeneratedData(updatedData);
    //     }
    // };

    const handleGenerateSeoData = async (indexValue: number) => {
        if (selectedImages.length <= 0 && productAttributes.product_context === "") {
            error('Please Enter Product images or Product Details')
            return;
        }
        const formData = new FormData();

        formData.append('description', generatedData[indexValue].description);
        formData.append('language', generatedData[indexValue].language);

        try {
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                updatedData[indexValue].loading = true;
                return updatedData;
            });
            const response = await apiInstance.post(`/product/product-content-generator/openai/gen-seo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const { seodata, language } = response.data.body;
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                if (seodata !== "") {
                    if (seodata.title_tag !== "") {
                        updatedData[indexValue].title_tag = seodata.title_tag
                    }
                    if (seodata.meta_description !== "") {
                        updatedData[indexValue].meta_description_tag = seodata.meta_description
                    }
                    if (seodata.keywords !== "") {
                        updatedData[indexValue].keywords_tag = seodata.keywords
                    }
                }
                if (language !== "") {
                    updatedData[indexValue].language = language;
                }
                return updatedData;
            });

        } catch (e) {
            error("somthing went wrong. Try again")
        }
        finally {
            setGeneratedData(prevData => {
                const updatedData = [...prevData];
                updatedData[indexValue].loading = false;
                return updatedData;
            });
        }
    }

    return (
        <div className={styles.maskContainer} onClick={() => setIsModalOpenNew(false)}>
            {contextHolder}
            <div
                className={styles.modelContainer}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <div className={styles.modelHeader}>
                    <h3 className={styles.infoContainerHeading}>Product Card</h3>

                    <div className={styles.infoContainerHeadingIcon}>

                        <MdOutlineSaveAs size={25} className={`${styles.pointer} ${styles.infoHeadingIcon}`}
                            onClick={() => { saveToLocalStorage() }} />
                        <RiShareForward2Line size={25} className={`${styles.pointer} ${styles.infoHeadingIcon}`} />
                        <RiAddLine size={25} className={`${styles.pointer} ${styles.infoHeadingIcon}`} />
                    </div>
                    <button onClick={() => setIsModalOpenNew(false)} ref={closeButtonRef} className={styles.pointer}>
                        <MdClose size={20} />
                    </button>
                </div>

                <hr style={{ margin: '10px 30px' }} />
                <div className={styles.infoContainer}>
                    <div className={styles.leftContainer}>
                        <div className={styles.headerContainer}>
                            <h3 className={styles.infoContainerHeading}>Item</h3>
                            <p className={styles.pointer}></p>
                        </div>
                        <div className={styles.productInfoContainer}>
                            <div className={styles.productInfoItem}>
                                <p>Product Name &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;</p>

                                <input type="text" className={styles.inputValue} value={productAttributes.productName} onChange={(e) => { handleProductAttributesChange('productName', e.target.value) }} />
                            </div>
                            <div className={styles.productInfoItem}>
                                <p>Brand &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;&middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;</p>
                                <input type="text" className={styles.inputValue} value={productAttributes.brand} onChange={(e) => { handleProductAttributesChange('brand', e.target.value) }} />
                            </div>
                            <div className={styles.productInfoItem}>
                                <p>Category  &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;</p>
                                <Dropdown
                                    menu={{ items: categoryOptions, onClick: handleCategoryChange }}
                                    className={styles.inputValue}
                                    overlayStyle={{ borderRadius: 0 }}
                                    trigger={['click']}
                                >
                                    <Space style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                        {productAttributes.category || '\u00A0'}
                                        <FaChevronDown />
                                    </Space>
                                </Dropdown>
                            </div>
                            <div className={styles.productInfoItem}>
                                <p>Language &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;</p>
                                <Dropdown
                                    menu={{ items: languageOptions, onClick: handleLanguageChange }}
                                    className={styles.inputValue}
                                    overlayStyle={{ borderRadius: 0 }}
                                    trigger={['click']}

                                >
                                    <Space style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                        {productAttributes.language || '\u00A0'}
                                        <FaChevronDown />
                                    </Space>
                                </Dropdown>
                            </div>
                            {/* <div className={styles.productInfoItem}>
                                <p>Product Details &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &</p>
                                <textarea className={styles.inputValue} rows={5} style={{ resize: 'none' }}
                                    value={productAttributes.product_context} onChange={(e) => {
                                        handleProductAttributesChange('product_context', e.target.value)
                                    }} />
                            </div> */}

                        </div>

                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.imageHeadingContainer}>
                            <h3 className={styles.infoContainerHeading}>Images <span id={styles.mandatory}>*</span> {selectedImages.length > 0 && <span className={styles.imageInfoText}>{currentIndex + 1}/{selectedImages.length}</span>}</h3>

                            {selectedImages.length > 0 && <button style={{ fontSize: 10 }} onClick={() => fileInputRef.current?.click()} className={styles.pointer}>Add More Images</button>}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className={styles.fileInput}
                                onChange={handleAddMoreFileChange}
                                style={{ display: 'none' }}
                                id="addmorefiles"
                                ref={fileInputRef}

                            />
                        </div>

                        <div className={styles.imgContainer}>
                            {selectedImages.length === 0 ? (
                                <div className={styles.uploaderWrapper}>
                                    <label htmlFor="files" className={styles.pointer} >Select Images</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className={styles.fileInput}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="files"

                                    />
                                </div>
                            ) : (
                                <div className={styles.uploaderWrapper}>
                                    {selectedImages[currentIndex] && (
                                        <img
                                            src={URL.createObjectURL(selectedImages[currentIndex])}
                                            alt={`Preview ${currentIndex}`}
                                            className={styles.imagePreview}
                                        />
                                    )}
                                    <MdDelete
                                        className={`${styles.delete} ${styles.pointer}`}
                                        size={20}
                                        onClick={() => handleDelete(currentIndex)}
                                    />
                                    <FaChevronLeft
                                        className={`${styles.uploaderWrapperLeft} ${styles.pointer}`}
                                        size={20}
                                        onClick={handlePrev}
                                    />
                                    <FaChevronRight
                                        className={`${styles.uploaderWrapperRight} ${styles.pointer}`}
                                        size={20}
                                        onClick={handleNext}
                                    />
                                </div>
                            )}
                        </div>



                    </div>

                </div>
                <hr style={{ marginTop: 20, margin: '0px 30px' }} />

                <div className={styles.generateWrapper}>
                    <div className={styles.tabWrapper}>
                        <div
                            className={`${styles.tabContainer} ${styles.pointer}`}
                            onClick={() => {
                                handleGenerate('both')
                            }}>
                            <span>Generate Title and Description</span>
                        </div>
                    </div>
                    {
                        generatedData.map((data, index) => {
                            return (
                                <Tabs key={index} defaultActiveKey="1" items={[
                                    {
                                        key: '1',
                                        label: 'Description',
                                        children: <div className={styles.genContainer}>
                                            <div className={styles.genOptionsWrapper}>
                                                <div className={styles.genOptionsWrapper}>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`}
                                                        onClick={() => { handleGenerate('desc') }}>
                                                        <RiAiGenerate color='#23666c' />
                                                        <p>Generate</p>
                                                    </div>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`}
                                                        onClick={() => {
                                                            setGeneratedData(prevData => {
                                                                const updatedData = [...prevData];
                                                                updatedData[index].editDesc = true;
                                                                return updatedData;
                                                            });
                                                        }}>
                                                        <RiEditLine color='#23666c' />
                                                        <p>Edit</p>

                                                    </div>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`} onClick={() => { setIsModalOpen(true) }}>
                                                        <MdGTranslate color='#23666c' />
                                                        <p>Translate</p>

                                                    </div>
                                                    {/* {
                                                        generatedData.length > 1 && <div className={`${styles.genOptionsContainer} ${styles.pointer}`} onClick={() => { handleDeleteGen(index) }}>
                                                            <MdDelete color='#23666c' />
                                                            <p>Delete</p>

                                                        </div>
                                                    } */}
                                                    <Modal title="Translate" open={isModalOpen} onOk={() => {
                                                        handleAddData(data.description, data.title)
                                                        setIsModalOpen(false)
                                                    }} onCancel={() => { setIsModalOpen(false) }}>
                                                        <div className={styles.productInfoItem}>
                                                            <p>Language &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;</p>
                                                            <Dropdown
                                                                menu={{ items: languageOptions, onClick: handleTranslateLanguageChange }}
                                                                className={styles.inputValue}
                                                                overlayStyle={{ borderRadius: 0 }}
                                                                trigger={['click']}
                                                            >
                                                                <Space style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    {newTranslateLanguage}
                                                                    <FaChevronDown />
                                                                </Space>
                                                            </Dropdown>
                                                        </div>

                                                    </Modal>
                                                </div>
                                                <div className={`${styles.genOptionsContainer} ${styles.pointer}`}>
                                                    <p className={styles.italic}>{data.language}</p>
                                                </div>
                                            </div>
                                            <hr style={{ borderColor: '#f5f8f786' }} />

                                            {
                                                data.description === '' ? !data.loading ? <div className={styles.genAnimationCon}>
                                                    <RiAiGenerate color='#23666c' size={30} onClick={() => { handleGenerate('desc') }} />
                                                    <p onClick={() => { handleGenerate('desc') }}><span>Generate text</span> based on the item attributes</p>
                                                </div> : <div className={styles.loading}>
                                                    <p>Generating...</p>
                                                    <RiLoader4Line className={styles.loadingAnimation} />
                                                </div> : <p
                                                    contentEditable={data.editDesc}

                                                    className={styles.genPara}>{data.description.split('\n').map((line, index) => (
                                                        <span key={index}>
                                                            {line}
                                                            <br />
                                                        </span>
                                                    ))}
                                                </p>
                                            }
                                        </div>
                                    },
                                    {
                                        key: '2',
                                        label: 'Title',
                                        children: <div className={styles.genContainer}>
                                            <div className={styles.genOptionsWrapper}>
                                                <div className={styles.genOptionsWrapper}>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`}
                                                        onClick={() => { handleGenerate('title') }}>
                                                        <RiAiGenerate color='#23666c' />
                                                        <p>Generate</p>
                                                    </div>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`}
                                                        onClick={() => {
                                                            setGeneratedData(prevData => {
                                                                const updatedData = [...prevData];
                                                                updatedData[index].editTitle = true;
                                                                return updatedData;
                                                            });
                                                        }}>
                                                        <RiEditLine color='#23666c' />
                                                        <p>Edit</p>
                                                    </div>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`} onClick={() => { setIsModalOpen(true) }}>
                                                        <MdGTranslate color='#23666c' />
                                                        <p>Translate</p>

                                                    </div>
                                                    {/* {
                                                        generatedData.length > 1 && <div className={`${styles.genOptionsContainer} ${styles.pointer}`} onClick={() => { handleDeleteGen(index) }}>
                                                            <MdDelete color='#23666c' />
                                                            <p>Delete</p>

                                                        </div>
                                                    } */}
                                                    <Modal title="Translate" open={isModalOpen} onOk={() => {
                                                        handleAddData(data.description, data.title)
                                                        setIsModalOpen(false)
                                                    }} onCancel={() => { setIsModalOpen(false) }}>
                                                        <div className={styles.productInfoItem}>
                                                            <p>Language &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;</p>
                                                            <Dropdown
                                                                menu={{ items: languageOptions, onClick: handleTranslateLanguageChange }}
                                                                className={styles.inputValue}
                                                                overlayStyle={{ borderRadius: 0 }}
                                                                trigger={['click']}
                                                            >
                                                                <Space style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    {newTranslateLanguage}
                                                                    <FaChevronDown />
                                                                </Space>
                                                            </Dropdown>
                                                        </div>

                                                    </Modal>
                                                </div>
                                                <div className={`${styles.genOptionsContainer} ${styles.pointer}`}>
                                                    <p className={styles.italic}>{data.language}</p>
                                                </div>
                                            </div>
                                            <hr style={{ borderColor: '#f5f8f786' }} />

                                            {
                                                data.title === '' ? !data.loading ? <div className={styles.genAnimationCon}>
                                                    <RiAiGenerate color='#23666c' size={30} onClick={() => { handleGenerate('title') }} />
                                                    <p onClick={() => { handleGenerate('title') }}><span>Generate text</span> based on the item attributes</p>
                                                </div> : <div className={styles.loading}>
                                                    <p>Generating...</p>
                                                    <RiLoader4Line className={styles.loadingAnimation} />
                                                </div> : <p contentEditable={data.editTitle} className={styles.genPara}>{data.title}
                                                </p>
                                            }
                                        </div>
                                    },
                                    {
                                        key: '3',
                                        label: 'SEO',
                                        children: <div className={styles.genContainer}>
                                            <div className={styles.genOptionsWrapper}>
                                                <div className={styles.genOptionsWrapper}>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`}
                                                        onClick={() => { handleGenerateSeoData(index) }}>
                                                        <RiAiGenerate color='#23666c' />
                                                        <p>Generate</p>
                                                    </div>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`}
                                                        onClick={() => {
                                                            setGeneratedData(prevData => {
                                                                const updatedData = [...prevData];
                                                                updatedData[index].editTitle = true;
                                                                return updatedData;
                                                            });
                                                        }}>
                                                        <RiEditLine color='#23666c' />
                                                        <p>Edit</p>
                                                    </div>
                                                    <div className={`${styles.genOptionsContainer} ${styles.pointer}`} onClick={() => { setIsModalOpen(true) }}>
                                                        <MdGTranslate color='#23666c' />
                                                        <p>Translate</p>

                                                    </div>

                                                    <Modal title="Translate" open={isModalOpen} onOk={() => {
                                                        handleAddData(data.description, data.title)
                                                        setIsModalOpen(false)
                                                    }} onCancel={() => { setIsModalOpen(false) }}>
                                                        <div className={styles.productInfoItem}>
                                                            <p>Language &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot; &middot;</p>
                                                            <Dropdown
                                                                menu={{ items: languageOptions, onClick: handleTranslateLanguageChange }}
                                                                className={styles.inputValue}
                                                                overlayStyle={{ borderRadius: 0 }}
                                                                trigger={['click']}
                                                            >
                                                                <Space style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    {newTranslateLanguage}
                                                                    <FaChevronDown />
                                                                </Space>
                                                            </Dropdown>
                                                        </div>

                                                    </Modal>
                                                </div>
                                                <div className={`${styles.genOptionsContainer} ${styles.pointer}`}>
                                                    <p className={styles.italic}>{data.language}</p>
                                                </div>
                                            </div>
                                            <hr style={{ borderColor: '#f5f8f786' }} />

                                            {
                                                data.title_tag === '' ? !data.loading ? <div className={styles.genAnimationCon}>
                                                    <RiAiGenerate color='#23666c' size={30} onClick={() => { handleGenerateSeoData(index) }} />
                                                    <p><span>Generate SEO Values</span> based on the generated description </p>
                                                </div> : <div className={styles.loading}>
                                                    <p>Generating...</p>
                                                    <RiLoader4Line className={styles.loadingAnimation} />
                                                </div> : <p contentEditable={data.editTitle} className={styles.genPara}>
                                                    <b> Title tag</b>: {data.title_tag}.
                                                    <br />
                                                    <b>Meta description</b>: {data.meta_description_tag}.
                                                    <br />
                                                    <b>Keywords</b>: {data.keywords_tag}.
                                                </p>
                                            }
                                        </div>
                                    },

                                ]} style={{ marginBottom: 20 }} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default NewItem;

