import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function App() {
  const [ocrText, setOcrText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Previsualizar la imagen
    const imageURL = URL.createObjectURL(file);
    setImagePreview(imageURL);

    // Realizar el reconocimiento de texto
    const worker = await Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(file);
    setOcrText(text);

    await worker.terminate();
  };

  return (
    <div className="App">
      <div>
        <p>Selecciona una imagen</p>
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </div>
      <div>
        {imagePreview && <img src={imagePreview} alt="Imagen seleccionada" style={{ maxWidth: '100%' }} />}
      </div>
      <div>
        <p>Texto reconocido:</p>
        <p>{ocrText}</p>
      </div>
    </div>
  );
}

export default App;
