import React, { useState, useEffect } from "react";

const useAudio = (url, play) => {
    const [audio] = useState(new Audio(url));

    useEffect(() => {
        audio.loop = true;
        audio.volume = 0.1;
        play ? audio.play() : audio.pause();
    }, [play]);
};

export default useAudio