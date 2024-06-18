import { Modal } from 'antd'

interface EditGenerationProps {
    isModalOpenEdit:boolean,
    handleOkEdit:()=>void,
    handleCancelEdit:()=>void,

}
const EditGeneration = ({handleCancelEdit,handleOkEdit,isModalOpenEdit }: EditGenerationProps) => {
    return (
        <Modal title="Basic Modal" open={isModalOpenEdit} onOk={handleOkEdit} onCancel={handleCancelEdit}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    )
}

export default EditGeneration