import { useCallback, useRef } from "react";
import "./App.css";
import React from "react";

const blobToBase64 = (blob: File) => {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

function App() {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  // const [isImg, setIsImg] = useState(false);
  // const [imgUrl, setImgUrl] = useState("");
  // const [base64String, setBase64String] = useState("");
  const handleMediaCapture = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const a = e.target.files[0];
      // const file = URL.createObjectURL(e.target.files[0]);
      // setIsImg(true);
      // setImgUrl(file);
      const base64 = await blobToBase64(a);
      // setBase64String(base64);
      console.log(base64);
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
          accept="image/*;capture=camera"
          onChange={handleMediaCapture}
        />
      </div>
      {/* {isImg && imgUrl && <img src={imgUrl} alt="Captured Image" />} */}
      {/* {isImg && imgUrl && <pre>{base64String}</pre>} */}
    </React.Fragment>
  );
}

export default App;
