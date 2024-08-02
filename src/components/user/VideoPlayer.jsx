import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { SERVER_ORIGIN } from "../../utilities/constants";
import "../../css/user/react-player.css";
// import { roundOffDecimalPlaces } from "../../utilities/helper_functions";
// const url = "https://www.youtube.com/watch?v=WQBldOTxN4M";

//todo: TO-READ => We've changed the architecture to save the progress, below are the steps we are using to store the live watch percentage of video
//todo: 1. We get the previous watch percentage of this video stored in database.
//todo: 2. set this previous in the current totalWatchPercentage state.
//todo: 3. Every second (handleProgress) the video is being played, the percentage for one second is updated in the totalWatchPercentage.
//todo: 4. Now we always have the latest watch percentage of video played in totalWatchPercentage State

//todo: TO-READ => When are we updating the progress in the database
//todo: In total we will update the progress in database "3" times
//todo: 1. When user pauses the video (handlePause)
//todo: 2. When user refreshes the page (useEffect dismount component) -----NOT ABLE TO ACHIEVE THIS SO WILL UPDATE PROGRESS AFTER EVERY 5 PERCENT INCREASE IN WATCH PERCENTAGE-----
//todo: 3. When user clicks on "Open Quiz button". Since we are enabling the button live once the watch criteria is fulfilled, so before leaving the page update the progress

const VideoPlayer = (props) => {
    useEffect(() => {
        toast('Please "pause" the video frequently to "save your progress"');
        //  return () => {
        //     ();
        //  }
    }, []);

    const params = useParams();

    const [totalDurationInSec, setTotalDurationInSec] = useState(0);
    //*to get live status of watch percentage, we will update the progress in below state
    const [totalWatchPercentage, setTotalWatchPercentage] = useState(
        props.storedWatchPercentage
    );
    const videoWatchTimeCutoffPercentage = props.videoWatchTimeCutoffPercentage;
    const oneSecWatchPercentage = 100 / totalDurationInSec;

    // get the total duration of the video
    function handleDuration(duration) {
        setTotalDurationInSec(duration);
    }

    // this function runs when the play button is pressed and also when the vdo starts to run for the first time
    //   function handlePlay() {
    //     setStartTimeInSec(performance.now()/1000);
    //   }

    //* Below runs every second the video is playing, update progress in total
    function handleProgress(state) {
        //*increase total percentage by percentage of one second
        const newWatchPercentage = totalWatchPercentage + oneSecWatchPercentage;
        // ("newWatchPercentage: ", newWatchPercentage);
        //* if the criteria of minimum watch percentage is fulfilled
        if (
            totalWatchPercentage <= videoWatchTimeCutoffPercentage &&
            newWatchPercentage > videoWatchTimeCutoffPercentage
        ) {
            toast.success("Quiz has been unlocked");
            props.handleChangeQuizState();
            updateVdoProgress();
        }
        setTotalWatchPercentage((prev) => {
            return newWatchPercentage;
        });
        // (totalWatchPercentage);
    }

    // this function runs when the pause button is pressed and doesnot run when the vdo stops at the last
    function handlePause() {
        // (totalWatchPercentage);
        updateVdoProgress();
    }

    //   ! MAJOR CHANGE: Now, instead of adding the session watch time into database using += we will have to update the old progress with this new one totalWatchPercentage, as this is the total watch percentage overall (previous + current)

    async function updateVdoProgress() {
        const { verticalId, courseId, unitId } = params;

        // ("updateVdoProgress: ", totalWatchPercentage);

        try {
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
             const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/student/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}/video/update-progress`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                       Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify({
                        vdoWatchTimeInPercent: totalWatchPercentage,
                    }),
                }
            );

            const result = await response.json();
            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    toast.error(
                        `${result.statusText}, Please try to login in a new tab, or you might loose your progress`
                    );
                } else if (response.status === 404) {
                    toast.error(result.statusText);
                } else {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                // (result);
            } else {
                // for future
            }
        } catch (error) {
            // (error.message);
        }
    }

    return (
        <div className="player-wrapper" style={{}}>
            <ReactPlayer
                url={props.video.vdoSrc}
                controls={true}
                className="react-player"
                width="100%"
                height="100%"
                onDuration={handleDuration}
                onProgress={handleProgress}
                // onPlay={handlePlay}
                onPause={handlePause}
            />
        </div>
    );
};

export default VideoPlayer;
