import React, { useEffect, useRef } from 'react';
import $ from 'jquery'; // Make sure you have jQuery installed

const SemiCircularProgress = ({ color, percentage }) => {
  const progressRef = useRef(null);

  useEffect(() => {
    const $bar = $(progressRef.current).find('.bar');
    const $val = $(progressRef.current).find('span');
    const perc = parseInt(percentage, 10);

    $({ p: 0 }).animate({ p: perc }, {
      duration: 3000,
      easing: 'swing',
      step: function (p) {
        $bar.css({
          transform: `rotate(${45 + p * 1.8}deg)`,
        });
        $val.text(p | 0);
      }
    });

    // Cleanup animation on component unmount
    return () => $bar.stop();
  }, [percentage]);

  // CSS styles as template literals
  const styles = `
    .progress {
      position: relative;
      margin: 4px;
      float: left;
      text-align: center;
      font-family: sans-serif;
      font-size: 18px;
    }
    .barOverflow {
      position: relative;
      overflow: hidden;
      width: 200px;
      height: 100px;
      margin-bottom: -14px;
    }
    .bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      box-sizing: border-box;
      border: 5px solid #0064c1;
      border-bottom-color: #47a6ff;
      border-right-color: #47a6ff;
      border-width: 20px;
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <div className="progress" ref={progressRef}>
        <div className="barOverflow">
          <div className="bar"></div>
        </div>
        <span>{percentage}</span>%
      </div>
    </div>
  );
};

export default SemiCircularProgress;
