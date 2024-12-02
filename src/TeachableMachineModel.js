import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';

function TeachableMachineModel(props) {
   
    const {submitTest } = props;
    const webcamContainerRef = useRef(null);
    const labelContainerRef = useRef(null);
    let [count , setCount] = useState(0);
    let [isExamSubmitted, setIsSubmitted] = useState(false);
    let model, webcam, labelContainer, maxPredictions;
    
    const init = async () => {
        const URL = "https://teachablemachine.withgoogle.com/models/3R8mtW38D/";

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        try {
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            const flip = true;
            webcam = new tmImage.Webcam(200, 200, flip);
            await webcam.setup();

            // Check if webcam setup is successful before calling play
            if (webcam && webcam.canvas) {
                await webcam.play();
                window.requestAnimationFrame(loop);

                webcamContainerRef.current.appendChild(webcam.canvas);
                labelContainer = labelContainerRef.current;
                for (let i = 0; i < maxPredictions; i++) {
                    labelContainer.appendChild(document.createElement("div"));
                }
            } else {
                console.error("Webcam setup failed or canvas is not available.");
            }
        } catch (error) {
            console.error("Error initializing Teachable Machine model or webcam:", error);
        }
    };

    const loop = async () => {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    };

    const predict = async () => {
        // Check if webcam and webcam.canvas are initialized
        if (!webcam || !webcam.canvas) {
            return;
        }

        const prediction = await model.predict(webcam.canvas);

        for (let i = 0; i < maxPredictions; i++) {
            // const classPrediction =
            //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            // labelContainer.childNodes[i].innerHTML = classPrediction;

            // Check if class2 has 99% probability
            if (prediction[1].probability >= 0.90) {
               
                setCount(count++);
                alert(" U R Moving !");
                console.log(count);
                if(count >= 5){  
                // submitTest();
                setIsSubmitted(true);
                break;
                }
                
            }
        }
    };
       
    useEffect(() => {
        init();

        return () => {
            // Check if webcam is initialized before calling stop method
            if (webcam) {
                webcam.stop();
            }
        };
    }, []); // Empty dependency array ensures init runs only once when component mounts

    return (
        <div>
            
            <div className='content'>
                <h2> Exam_monitoring_System</h2>
                <h4>  Be carefull !! Otherwise Exam Should Be Submitted Automatically</h4>
                <h3> ALL THE BEST </h3>
            </div>
                     
                       {/* Remove init from onClick */}
            <button type="button"  style={{ display: 'none' }}>Start</button>
            {/* Add style to hide webcam container */}
            <div ref={webcamContainerRef} style={{ display: 'none' }} ></div>
            <div ref={labelContainerRef}></div>

            {isExamSubmitted && (
        <div className="modal">
          <div className="modal-content">
            <h2>Oh no, exam submitted!</h2>
            <p>Thank you for participating. </p>
          </div>
        </div>
      )}

        </div>
    );
}

export default TeachableMachineModel;