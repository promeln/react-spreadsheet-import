import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useCallback } from 'react';
import { useStyleConfig, ModalBody, Box, Heading, Button, Switch } from '@chakra-ui/react';
import { ContinueButton } from '../../components/ContinueButton.js';
import { useRsi } from '../../hooks/useRsi.js';
import { addErrorsAndRunHooks } from './utils/dataMutations.js';
import { generateColumns } from './components/columns.js';
import { Table } from '../../components/Table.js';
import { SubmitDataAlert } from '../../components/Alerts/SubmitDataAlert.js';

const ValidationStep = ({ initialData, file }) => {
    const { translations, fields, onClose, onSubmit, rowHook, tableHook, submitFailHook } = useRsi();
    const styles = useStyleConfig("ValidationStep");
    const [data, setData] = useState(useMemo(() => addErrorsAndRunHooks(initialData, fields, rowHook, tableHook), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []));
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [filterByErrors, setFilterByErrors] = useState(false);
    const [showSubmitAlert, setShowSubmitAlert] = useState(false);
    const updateData = useCallback((rows) => {
        setData(addErrorsAndRunHooks(rows, fields, rowHook, tableHook));
    }, [setData, rowHook, tableHook, fields]);
    const deleteSelectedRows = () => {
        if (selectedRows.size) {
            const newData = data.filter((value) => !selectedRows.has(value.__index));
            updateData(newData);
            setSelectedRows(new Set());
        }
    };
    const updateRow = useCallback((rows, changedData) => {
        const changes = changedData?.indexes.reduce((acc, index) => {
            // when data is filtered val !== actual index in data
            const realIndex = data.findIndex((value) => value.__index === rows[index].__index);
            acc[realIndex] = rows[index];
            return acc;
        }, {});
        const newData = Object.assign([], data, changes);
        updateData(newData);
    }, [data, updateData]);
    const columns = useMemo(() => generateColumns(fields), [fields]);
    const tableData = useMemo(() => {
        if (filterByErrors) {
            return data.filter((value) => {
                if (value?.__errors) {
                    return Object.values(value.__errors)?.filter((err) => err.level === "error").length;
                }
                return false;
            });
        }
        return data;
    }, [data, filterByErrors]);
    const rowKeyGetter = useCallback((row) => row.__index, []);
    const submitData = () => {
        const calculatedData = data.reduce((acc, value) => {
            const { __index, __errors, ...values } = value;
            if (__errors) {
                for (const key in __errors) {
                    if (__errors[key].level === "error") {
                        acc.invalidData.push(values);
                        return acc;
                    }
                }
            }
            acc.validData.push(values);
            return acc;
        }, { validData: [], invalidData: [], all: data });
        const res = onSubmit(calculatedData, file);
        if (res?.then) { //if onSubmit returns Promise
            res.then((res) => {
                if (res?.error) {
                    setData(addErrorsAndRunHooks(data, [], undefined, undefined, submitFailHook, res.error));
                    return;
                }
                setShowSubmitAlert(false);
                onClose();
            });
        }
        else {
            setShowSubmitAlert(false);
            onClose();
        }
    };
    const onContinue = () => {
        const invalidData = data.find((value) => {
            if (value?.__errors) {
                return !!Object.values(value.__errors)?.filter((err) => err.level === "error").length;
            }
            return false;
        });
        if (!invalidData) {
            submitData();
        }
        else {
            setShowSubmitAlert(true);
        }
    };
    return (jsxs(Fragment, { children: [jsx(SubmitDataAlert, { isOpen: showSubmitAlert, onClose: () => setShowSubmitAlert(false), onConfirm: submitData }), jsxs(ModalBody, { pb: 0, children: [jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: "2rem", flexWrap: "wrap", gap: "8px", children: [jsx(Heading, { sx: styles.heading, children: translations.validationStep.title }), jsxs(Box, { display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", children: [jsx(Button, { variant: "outline", size: "sm", onClick: deleteSelectedRows, children: translations.validationStep.discardButtonTitle }), jsx(Switch, { display: "flex", alignItems: "center", isChecked: filterByErrors, onChange: () => setFilterByErrors(!filterByErrors), children: translations.validationStep.filterSwitchTitle })] })] }), jsx(Box, { h: 0, flexGrow: 1, children: jsx(Table, { rowKeyGetter: rowKeyGetter, rows: tableData, onRowsChange: updateRow, columns: columns, selectedRows: selectedRows, onSelectedRowsChange: setSelectedRows, components: {
                                noRowsFallback: (jsx(Box, { display: "flex", justifyContent: "center", gridColumn: "1/-1", mt: "32px", children: filterByErrors
                                        ? translations.validationStep.noRowsMessageWhenFiltered
                                        : translations.validationStep.noRowsMessage })),
                            } }) })] }), jsx(ContinueButton, { onContinue: onContinue, title: translations.validationStep.nextButtonTitle })] }));
};

export { ValidationStep };
