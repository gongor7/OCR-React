import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

const CAPTURED_IMAGE_WIDTH = 400; // Ancho predefinido para la imagen capturada
const CAPTURED_IMAGE_HEIGHT = 400; // Alto predefinido para la imagen capturada

function App() {
  const [croppedImage, setCroppedImage] = useState({ image1: null, image2: null, image3:null });
  const [ocrText, setOcrText] = useState({ text1: null, text2: null, text3:null });
  const webcamRef = useRef(null);

  const captureAndCropImage = async () => {
    // Capturar una imagen desde la cámara web
    const imageSrc = webcamRef.current.getScreenshot();

    // Crear un elemento de imagen para cargar la imagen capturada
    const img = new Image();
    img.onload = async () => {
      // Ajustar el área de recorte y las dimensiones del lienzo según el tamaño predefinido
      const cropX1 = 0; // Coordenada x del cuadrante superior izquierdo
      const cropY1 = 0; // Coordenada y del cuadrante superior izquierdo
      // Crear un lienzo y dibujar la parte recortada de la imagen original en el lienzo
      const canvas1 = document.createElement('canvas');
      const ctx1 = canvas1.getContext('2d');
      console.log(img.width)
      console.log(CAPTURED_IMAGE_WIDTH/3)
      canvas1.width = img.width/3;
      canvas1.height = CAPTURED_IMAGE_HEIGHT;
      ctx1.drawImage(img, cropX1, cropY1, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT);
      const dataURL1 = canvas1.toDataURL('image/jpeg');

      const cropX2 = img.width/3; // Coordenada x del cuadrante superior derecho
      const cropY2 = 0; // Coordenada y del cuadrante superior derecho
      // Crear un lienzo y dibujar la parte recortada de la imagen original en el lienzo
      const canvas2 = document.createElement('canvas');
      const ctx2 = canvas2.getContext('2d');
      canvas2.width = img.width/3;
      canvas2.height = CAPTURED_IMAGE_HEIGHT;
      ctx2.drawImage(img, cropX2, cropY2, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT);
      const dataURL2 = canvas2.toDataURL('image/jpeg');

      const cropX3 = (img.width/3)*2; // Coordenada x del cuadrante superior izquierdo
      const cropY3 = 0; // Coordenada y del cuadrante superior izquierdo
      // Crear un lienzo y dibujar la parte recortada de la imagen original en el lienzo
      const canvas3 = document.createElement('canvas');
      const ctx3 = canvas3.getContext('2d');
      canvas3.width = img.width/3;
      canvas3.height = CAPTURED_IMAGE_HEIGHT;
      ctx3.drawImage(img, cropX3, cropY3, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT);
      const dataURL3 = canvas3.toDataURL('image/jpeg');

      setCroppedImage({ image1: dataURL1, image2: dataURL2, image3:dataURL3 });

      // Realizar el reconocimiento de texto
      const worker = await Tesseract.createWorker();


      const { data: { text: text1 } } = await worker.recognize(dataURL1);
      const { data: { text: text2 } } = await worker.recognize(dataURL2);
      const { data: { text: text3 } } = await worker.recognize(dataURL3);

      setOcrText({ text1, text2, text3 });

      await worker.terminate();
    };
    img.src = imageSrc;
  };

  return (
    <div>
      <Webcam
        audio={false}
        mirrored={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: 'user',
        }}
        style={{
          borderRadius: '10px',
        }}
      />
      <button onClick={captureAndCropImage}>Capturar y Recortar</button>
      <p></p>
      {croppedImage.image1 && <img src={croppedImage.image1} alt="Cropped Image Top Left" style={{ marginRight: '10px' }} />}
      {croppedImage.image2 && <img src={croppedImage.image2} alt="Cropped Image Top Right" style={{ marginRight: '10px' }}/>}
      {croppedImage.image3 && <img src={croppedImage.image3} alt="Cropped Image" style={{ marginRight: '10px' }}/>}
      <p>{ocrText.text1}</p>
      <p>{ocrText.text2}</p>
      <p>{ocrText.text3}</p>
    </div>
  );
}

export default App;
