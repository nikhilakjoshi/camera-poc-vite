// import Webcam from "react-webcam";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
// import { Camera, CameraType } from "react-camera-pro";
import Webcam from "react-webcam";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  //   const cameraProRef = useRef<CameraType>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPicClicked, setIsPicClicked] = useState(false);
  const [imgSrc] = useState<string | null | undefined>(null);
  const imageCapture = useRef<ImageCapture | null>(null);
  const [screenShotSrc, setScreenShotSrc] = useState<string | null | undefined>(
    null
  );
  const imgRef = useRef<HTMLImageElement>(null);

  const { screenShotHeight, screenShotWidth } = useMemo(() => {
    const height = window.screen.availHeight;
    const width = window.screen.availWidth;
    const ratio = width / height;
    const screenShotHeight = height - 200;
    const screenShotWidth = screenShotHeight * ratio;
    return {
      height,
      width,
      ratio,
      screenShotHeight,
      screenShotWidth,
    };
  }, []);

  //   useEffect(() => {
  //     const a = webcamRef.current?.stream;
  //   }, []);

  const handleCapture = useCallback(async () => {
    setScreenShotSrc(null);
    // const a = cameraProRef.current?.takePhoto();
    // const a = webcamRef.current?.getScreenshot();
    // setImgSrc(a);
    // setIsPicClicked(true);
    // console.log(imageCapture.current);
    if (imageCapture.current) {
      const capabilities = await imageCapture.current.getPhotoCapabilities();
      console.log({ capabilities });
      imageCapture.current
        .takePhoto({
          fillLightMode: capabilities.fillLightMode?.includes("flash")
            ? "flash"
            : undefined,
        })
        .then((blob: any) => {
          console.log(blob);
        });
    }
  }, [screenShotHeight, screenShotWidth]);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onload = () => {
        // * OLD FUNCTION * //
        // const canvas = canvasRef.current;
        // const ctx = canvas?.getContext("2d");
        // if (!ctx || !screenShotSrc || !canvas) return;
        // canvas.width = imgRef.current!.width;
        // canvas.height = imgRef.current!.height;
        // const w = (ctx.canvas.width = imgRef.current!.width);
        // const h = (ctx.canvas.height = imgRef.current!.height);
        // ctx.drawImage(imgRef.current!, 0, 0, w, h);
        // const d = ctx.getImageData(0, 0, w, h); // Get image Data from Canvas context
        // for (let i = 0; i < d.data.length; i += 4) {
        //   d.data[i] =
        //     d.data[i + 1] =
        //     d.data[i + 2] =
        //       d.data[i + 1]! > 180 ? 255 : 0;
        // }
        // ctx.putImageData(d, 0, 0);
        // * OLD FUNCTION ENDS * //
        // * NEW KONVA FUNCTION * //
        const stage = new Konva.Stage({
          container: "canvas",
          width: imgRef.current!.width,
          height: imgRef.current!.height,
        });
        const layer = new Konva.Layer();
        const image = new Konva.Image({
          image: imgRef.current!,
        });
        image.cache();
        image.filters([Konva.Filters.Brighten, Konva.Filters.Enhance]);
        layer.add(image);
        stage.add(layer);
        image.enhance(0.5);
        // * NEW KONVA FUNCTION ENDS * //
        const croppedDataUrl = image.toDataURL({
          quality: 1,
          pixelRatio: 1,
          mimeType: "image/png",
          height: screenShotHeight,
          width: screenShotWidth,
          x: (image.width() - screenShotWidth) / 2,
          y: (image.height() - screenShotHeight) / 2,
        });
        console.log(croppedDataUrl.split(",")[1]);
        setScreenShotSrc(croppedDataUrl);
      };
    }
  }, [imgSrc]);

  useEffect(() => {
    if (webcamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          const track = mediaStream.getVideoTracks()[0];
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
          if (track) imageCapture.current = new ImageCapture(track);
        });
    }
  }, [webcamRef.current]);

  const Comp = () => {
    if (isPicClicked)
      return (
        <div className="relative h-[100dvh] w-[100dvw]">
          {screenShotSrc && (
            <img
              src={screenShotSrc}
              alt="test"
              className="h-[100dvh] w-[100dvw] object-cover"
            />
          )}
          <div id="canvas" className="hidden"></div>
          <button
            onClick={() => setIsPicClicked(false)}
            className="absolute right-4 top-12 z-10 rotate-90 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      );
    return (
      <div className="relative h-[100dvh] w-[100dvw]">
        {/* <video className="h-screen w-screen" ref={videoRef} /> */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          imageSmoothing={false}
          className="w-screen h-screen object-cover"
          screenshotQuality={1}
          videoConstraints={{
            facingMode: "environment",
          }}
        />
        {/* <Camera
          facingMode="environment"
          aspectRatio="cover"
          errorMessages={{}}
          ref={cameraProRef}
        /> */}
        <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center">
          <button
            onClick={handleCapture}
            className="mx-auto aspect-square h-16 rounded-full border-4 border-blue-200 bg-blue-400 bg-opacity-75 outline-1 outline-lime-200"
          ></button>
        </div>
        {/* <div className="cheque frame absolute inset-0 grid place-items-center">
          <div
            className="rounded border-2 border-white"
            style={{
              width: screenShotWidth,
              height: screenShotHeight,
            }}
          ></div>
        </div> */}
        {/* <div className="absolute left-0 right-0 top-2">
          <div className="rounded bg-white">
            {`screenshotHeight: ${screenShotHeight}, screenshotWidth: ${screenShotWidth}, height: ${height}, width: ${width}, ratio: ${ratio}`}
          </div>
        </div> */}
      </div>
    );
  };

  return (
    <>
      <main>
        <Comp />
        {imgSrc && (
          <img alt="al image" className="hidden" ref={imgRef} src={imgSrc} />
        )}
      </main>
    </>
  );
}
