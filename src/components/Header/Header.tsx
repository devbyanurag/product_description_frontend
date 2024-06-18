import styles from "./Header.module.css";
import { PiDotsNine } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa6";

const Header = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logo_container}>
                <PiDotsNine size={30} id={styles.logoText} />
                <p>Product Description</p>
            </div>
            <div className={styles.actions_container}>
                <CiSearch size={20} id={styles.logoText} className={`${styles.hoverCursor}`} />
                <IoIosNotificationsOutline size={20} id={styles.logoText} className={`${styles.hoverCursor}`} />
                <IoSettingsOutline size={20} id={styles.logoText} className={`${styles.hoverCursor}`} />
                <FaQuestion size={20} id={styles.logoText} className={`${styles.hoverCursor}`} />
                <div className={`${styles.profileCon} ${styles.hoverCursor}`}>
                    <p>AC</p>
                </div>

            </div>
        </div>
    )
}

export default Header