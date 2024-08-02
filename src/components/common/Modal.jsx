import { Modal } from "react-bootstrap";
// import Text from "../Text";

/**
 * This component is used to create a modal with the given title and size
 * @param {Boolean} show
 * @param {Function} setIsShow
 * @param {String} title
 * @param {String} size sm | lg | xl
 * @param {Component} children
 * @returns {Component}
 *
 * @example
 * <Modal
 * show={showModal}
 * setIsShow={setShowModal}
 * title="Add DFR"
 * size="sm"
 * >
 *  {children}
 * </ModalComponent>
 */

// const [showModal, setShowModal] = React.useState(false);
/* <Button
    type="button"
    secondary
    onClick={() => {
        setShowModal(false);
    }}
>
    Cancel
</Button> */
/* <ModalComponent
    show={showModal}
    setIsShow={setShowModal}
    title="Enter Certification Date"
    size="lg"
> */

export default function ModalComponent({
    show,
    setIsShow,
    title,
    size = "xl",
    children,
}) {

    const modalBase = { overflow: "auto", border: `0px` }
    const baseStyle = { padding: "1.25rem" }


    const handleClose = () => {
        setIsShow(false);
    };
    return (
        <Modal
            show={show}
            onHide={handleClose}
            size={size}
            centered
            style={modalBase}
        >
            <Modal.Header
                className="modal-header"
                closeButton
                closeVariant="white"
                size={size}
            >
                <div>
                    {/* <div size={18} weight={600} color="white"> */}
                    {title}
                </div>
            </Modal.Header>

            <Modal.Body style={baseStyle}>{children}</Modal.Body>
        </Modal>
    );
}
