import { useCallback, useRef, useState } from "react";
import "./App.css";
import React from "react";

function App() {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isImg, setIsImg] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const handleMediaCapture = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = URL.createObjectURL(e.target.files[0]);
      console.log(file);
      setIsImg(true);
      setImgUrl(file);
    },
    []
  );

  return (
    <React.Fragment>
      <div className="mainContainer">
        <label htmlFor="cameraInput" className="cameraLabel">
          Open Camera
        </label>
        <input
          ref={cameraInputRef}
          type="file"
          name="cameraInput"
          id="cameraInput"
          capture="environment"
          accept="image/*"
          onChange={handleMediaCapture}
        />
      </div>
      {isImg && imgUrl && <img src={imgUrl} alt="Captured Image" />}
    </React.Fragment>
  );
}

export default App;
