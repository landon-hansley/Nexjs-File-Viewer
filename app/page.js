'use client'
import Image from "next/image";
import './page.css'
import { useState } from "react";

const initialFiles = {

}

function DisplayFiles({ file, depth }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <div onClick={() => { setExpanded(!expanded) }} className={`File`} style={{ marginLeft: 20 * depth + "px", width: 500 - 20 * depth }}>
        {file.Child ?
          <div style={{marginRight: '5px'}}>
            {expanded ? "-" : "+"}
          </div>
          :
          null
        }
        {file.Name}
      </div>
      {expanded ? file.Child?.map((files) => (
        <DisplayFiles key={files.Name} file={files} depth={depth + 1} />
      )) : null}
    </div>
  )
}

function Home() {
  const [files, setFiles] = useState(initialFiles);

  const handleUpload = (event) => {
    const uploadedFiles = event.target.files;
    const fileTree = {};

    for (const file of uploadedFiles) {
      const pathParts = file.webkitRelativePath.split('/');
      let currentLevel = fileTree;

      pathParts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = { Name: part, Child: index === pathParts.length - 1 ? null : [] };
        }
        if (currentLevel[part].Child && index !== pathParts.length - 1) {
          currentLevel = currentLevel[part].Child;
        }
      });
    }

    const transformToArray = (obj) => {
      return Object.values(obj).map((value) => {
        if (value.Child) {
          value.Child = transformToArray(value.Child);
        }
        return value;
      });
    };

    setFiles({ Child: transformToArray(fileTree) });
  };

  return (
    <div className="FileWrapper">
      <input className="UploadButton" type="file" webkitdirectory="true" directory="true" onChange={handleUpload} />
      {files.Child?.map((file) => (
        <DisplayFiles key={file.Name} file={file} depth={0} />
      ))}
    </div>
  );
}

export default Home;
