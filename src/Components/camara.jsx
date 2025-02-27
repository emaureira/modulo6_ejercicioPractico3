import React, { useRef, useEffect, useState}  from "react";

const Camara = ({ onCapture }) =>{
    const videoRef = useRef(null);
    const canvasRef = useRef(null);  
    const [stream, setStream] = useState(null)
    const [error, setError] = useState('');

    useEffect (() => {
        const startCamara = async () => {
            try{
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {facingMode: "Enviroment"},
                });
                setStream(mediaStream);
                if(videoRef.current){
                    videoRef.current.srcObject = mediaStream;
                }
            }
            catch(err){
                setError('No se puede acceder a la camara');
                console.error(err);
            }
        }
        startCamara();

        return () => {
            if(stream){
                stream.getTracks().forEach((track) => track.strop());
            }
        }
    },[]);

    const handleTakePhoto = () => {
        event.preventDefault();
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Establece las dimensiones del canvas igual al video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Dibuja la imagen del video en el canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Opcional: Guarda la imagen
            const imageUrl = canvas.toDataURL('image/png'); 
            console.log(imageUrl)  // Puedes guardar esta URL en el estado o enviarla a un backend

            if(onCapture){
                onCapture(imageUrl); // Llamar al callback
            }

             // Crear un enlace temporal
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'foto.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    return (
        <div>
            <h2>Acceso Camara</h2>
           {error && <p style={{ color: 'red' }}>{error}</p>}
            <video ref={videoRef} autoPlay playsInline style={{ width : "25%"}} />
            <button id="foto" onClick={handleTakePhoto}>Tomar Foto</button>
            <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
    )
};

export default Camara;