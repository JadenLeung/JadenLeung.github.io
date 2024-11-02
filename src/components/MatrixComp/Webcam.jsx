import React, { useEffect, useRef } from 'react';

const Webcam = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Function to start the webcam stream
    const startWebcam = async () => {
      try {
        // Access the webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Set the video source to the webcam stream
        }
      } catch (error) {
        console.error("Error accessing the webcam: ", error);
      }
    };

    startWebcam(); // Start the webcam when the component mounts

    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '400px', height: 'auto', border: '1px solid black' }} />
    </div>
  );
};

export default Webcam;
