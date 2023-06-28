'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react$1 = require('@chakra-ui/react');
var cg = require('react-icons/cg');
var ConfirmCloseAlert = require('./Alerts/ConfirmCloseAlert.js');
var react = require('react');

const ModalCloseButton = ({ onClose }) => {
    const [showModal, setShowModal] = react.useState(false);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(ConfirmCloseAlert.ConfirmCloseAlert, { isOpen: showModal, onClose: () => setShowModal(false), onConfirm: () => {
                    setShowModal(false);
                    onClose();
                } }), jsxRuntime.jsx(react$1.IconButton, { variant: "unstyled", "aria-label": "Close modal", icon: jsxRuntime.jsx(cg.CgClose, {}), color: "white", position: "absolute", transform: "translate(50%, -50%)", right: "14px", top: "20px", onClick: () => setShowModal(true), zIndex: "toast", dir: "ltr" })] }));
};

exports.ModalCloseButton = ModalCloseButton;
