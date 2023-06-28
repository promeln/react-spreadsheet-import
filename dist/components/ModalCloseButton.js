import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { IconButton } from '@chakra-ui/react';
import { CgClose } from 'react-icons/cg';
import { ConfirmCloseAlert } from './Alerts/ConfirmCloseAlert.js';
import { useState } from 'react';

const ModalCloseButton = ({ onClose }) => {
    const [showModal, setShowModal] = useState(false);
    return (jsxs(Fragment, { children: [jsx(ConfirmCloseAlert, { isOpen: showModal, onClose: () => setShowModal(false), onConfirm: () => {
                    setShowModal(false);
                    onClose();
                } }), jsx(IconButton, { variant: "unstyled", "aria-label": "Close modal", icon: jsx(CgClose, {}), color: "white", position: "absolute", transform: "translate(50%, -50%)", right: "14px", top: "20px", onClick: () => setShowModal(true), zIndex: "toast", dir: "ltr" })] }));
};

export { ModalCloseButton };
