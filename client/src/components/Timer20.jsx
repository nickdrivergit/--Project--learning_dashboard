import React, { useState, useEffect } from 'react'

const Timer20 = () => {

    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = .50;
    const ALERT_THRESHOLD = .25;

    const COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };

    const TIME_LIMIT = 1200;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;


    const [startState, setStartState] = useState(false);
    const [pauseState, setPauseState] = useState(false);
    const [resumeState, setResumeState] = useState(false);
    const [finished, setFinished] = useState(false);

    const [intervalVar, setIntervalVar] = useState(null);
    const [tracker, setTracker] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        document.getElementById("base-timer-label").innerHTML = formatTime(
            TIME_LIMIT - tracker
        );
        setCircleDasharray();
        setRemainingPathColor((TIME_LIMIT - tracker)/TIME_LIMIT);
        if (TIME_LIMIT - tracker === 0) {
            onTimesUp();
            window.clearTimeout(intervalVar);
        } else {
            if(startState){
                setIntervalVar(window.setTimeout(() => timerOperations(1), 1000))
            }
        }
    }, [tracker, startState])
    const timerOperations = (arg) => {
        if(arg === 0){
            setTracker(0)
        } else {
            setTracker(tracker + 1)
        }
    }

    const onClickHandler1 = () => {
        setStartState(!startState)
        setPauseState(!pauseState)
        startTimer(0)
    }

    const onTimesUp = () => {
        clearInterval(intervalVar);
        setStartState(false);
        setPauseState(false);
        setResumeState(false);
        setFinished(true);
    }

    const startTimer = (arg) => {
        timerOperations(arg);
    }

    const pauseTimer = () => {
        window.clearTimeout(intervalVar);
        console.log(tracker);
    }

    const onClickHandler2 = () => {
        setPauseState(!pauseState);
        setResumeState(!resumeState);
        pauseTimer();
    }

    const onClickHandler3 = () => {
        setResumeState(!resumeState);
        setPauseState(!pauseState);
        startTimer(1);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    }

    const setRemainingPathColor = (timeLeft) => {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        } else {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(alert.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(info.color);
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = (TIME_LIMIT - tracker) / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction(tracker) * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }


    return (
        <div className="base-timer">
            <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className="base-timer__circle">
                    <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                    <path
                        id="base-timer-path-remaining"
                        stroke-dasharray="283"
                        className={`base-timer__path-remaining ${remainingPathColor}`}
                        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
                    ></path>
                </g>
            </svg>
            <span id="base-timer-label" className="base-timer__label">{formatTime(
                TIME_LIMIT - tracker
            )}</span>
            <div className="buttons">
                <button disabled={startState} onClick={onClickHandler1}>Start</button>
                <button disabled={!pauseState} onClick={onClickHandler2}>Pause</button>
                <button disabled={!resumeState} onClick={onClickHandler3}>Resume</button>
            </div>
        </div>
    )
}

export default Timer20
