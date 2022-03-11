import { Box, Button, Text, useTheme, useToast } from "@chakra-ui/react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { useState } from "react"
import { getDropZoneBorder } from "../utils/getDropZoneBorder"
import { useRsi } from "../../../hooks/useRsi"
import { readFileAsync } from "../utils/readFilesAsync"

type DropZoneProps = {
  onContinue: (data: XLSX.WorkBook) => void
}

export const DropZone = ({ onContinue }: DropZoneProps) => {
  const { translations, maxFileSize } = useRsi()
  const {
    colors: { rsi },
  } = useTheme()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: maxFileSize,
    accept: ".xls, .csv, .xlsx",
    onDropRejected: (fileRejections) => {
      setLoading(false)
      fileRejections.forEach((fileRejection) => {
        toast({
          status: "error",
          variant: "left-accent",
          position: "bottom-left",
          title: `${fileRejection.file.name} ${translations.uploadStep.dropzone.errorToastDescription}`,
          description: fileRejection.errors[0].message,
        })
      })
    },
    onDrop: async ([file]) => {
      setLoading(true)
      const arrayBuffer = await readFileAsync(file)
      const workbook = XLSX.read(arrayBuffer)
      onContinue(workbook)
      setLoading(false)
    },
  })

  return (
    <Box
      {...getRootProps()}
      {...getDropZoneBorder(rsi["500"])}
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      flex={1}
    >
      <input {...getInputProps()} data-testid="rsi-dropzone" />
      {isDragActive ? (
        <Text size="lg" lineHeight={7} fontWeight="semibold">
          {translations.uploadStep.dropzone.activeDropzoneTitle}
        </Text>
      ) : loading ? (
        <Text size="lg" lineHeight={7} fontWeight="semibold">
          {translations.uploadStep.dropzone.loadingTitle}
        </Text>
      ) : (
        <>
          <Text fontSize="lg" lineHeight={7} fontWeight="semibold">
            {translations.uploadStep.dropzone.title}
          </Text>
          <Button mt="1rem" onClick={open}>
            {translations.uploadStep.dropzone.buttonTitle}
          </Button>
        </>
      )}
    </Box>
  )
}