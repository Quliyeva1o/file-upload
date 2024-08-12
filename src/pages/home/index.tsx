import React, { useState } from "react";
import { Table, Modal, notification } from "antd";
import styles from "./index.module.scss";

const Home: React.FC = () => {

  const [blobUrls, setBlobUrls] = useState<{ url: string; type: string; name: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    type: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newBlobUrls: { url: string; type: string; name: string }[] = [];
      Array.from(files).forEach((file) => {
        if (file.name.endsWith(".jpg")) {
          notification.error({
            message: "Unsupported File Type",
            description: "JPG files are not supported.",
          });
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              const blob = new Blob([reader.result as ArrayBuffer], {
                type: file.type,
              });
              const url = URL.createObjectURL(blob);
              newBlobUrls.push({ url, type: file.type, name: file.name });
              if (newBlobUrls.length === files.length) {
                setBlobUrls((prevUrls) => [...prevUrls, ...newBlobUrls]);
              }
            } catch (error) {
              console.error("Error reading file:", error);
            }
          };
          reader.readAsArrayBuffer(file);
        }
      });
    }
  };

  const handleModalClick = (file: { url: string; type: string }) => {
    setSelectedFile(file);
  };

  const handleModalClose = () => {
    setSelectedFile(null);
  };

  const dataSource = blobUrls.map((file, index) => ({
    key: index,
    url: file.url,
    type: file.type,
    name: file.name,
  }));

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className={styles.fileName}>{text}</span>,
    },
    {
      title: "File URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.fileUrl}
        >
          {url}
        </a>
      ),
    },
    {
      title: "File Preview",
      dataIndex: "url",
      key: "preview",
      render: (url: string, record: { type: string }) => (
        <div
          onClick={() => handleModalClick({ url, type: record.type })}
          className={styles.filePreview}
        >
          <span>View</span>
        </div>
      ),
    },
  ];


  const fileTips = [
    {
      startsWith: "audio/",
      component: (
        <audio
          controls
          src={selectedFile?.url}
          className={styles.modalContent}
        />
      ),
    },
    {
      startsWith: "video/",
      component: (
        <video
          controls
          src={selectedFile?.url}
          className={styles.modalContent}
        />
      ),
    },
    {
      startsWith: "image/",
      component: (
        <img src={selectedFile?.url} className={styles.modalContent} />
      ),
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className={styles.inputFile}
        />
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className={styles.uploadsTable}
        />
        <Modal
          open={!!selectedFile}
          footer={null}
          onCancel={handleModalClose}
          width="80%"
          className={styles.modalTop}
        >
          {selectedFile && (
            <>
              {fileTips.map((filee) =>
                selectedFile.type.startsWith(filee.startsWith)
                  ? filee.component
                  : null
              )}
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Home;
