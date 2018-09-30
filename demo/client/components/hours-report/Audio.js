import entryRegistered from '../../../server/public/entry-registered.mp3';
import exitRegistered from '../../../server/public/exit-registered.mp3';
import employeeCodeInvalid from '../../../server/public/employee-code-invalid.mp3';
import unexpectedError from '../../../server/public/unexpected-error.mp3';
import doubleEntry from '../../../server/public/double-entry.mp3';
import doubleExit from '../../../server/public/double-exit.mp3';
import missingInput from '../../../server/public/missing-input.mp3';

const audios = {
    'missingInput': new Audio(missingInput),
    'entryRegistered': new Audio(entryRegistered),
    'exitRegistered': new Audio(exitRegistered),
    'employeeCodeInvalid': new Audio(employeeCodeInvalid),
    'unexpectedError': new Audio(unexpectedError),
    'doubleEntry': new Audio(doubleEntry),
    'doubleExit': new Audio(doubleExit),
};

let currentlyPlaying = null;

const play = (name) => {
    console.log('playing:', name);

    if (currentlyPlaying) {
        audios[currentlyPlaying].pause();
    }
    audios[name].play();
    currentlyPlaying = name;
};

const pause = (name) => {
    currentlyPlaying = null;
    audios[name].pause();
};

export default {
    pause,
    play
};