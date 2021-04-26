import { WriteStream, createReadStream, createWriteStream } from "fs";
import { createInterface } from "readline";
import axios from "axios";

const date = new Date();

// get month says january = 0
const dateTimePretty = getDateTimePretty(date);
const dateTimeFileName = getDateTimeFileName(date);

class Config {
    url: string
    key: string

    constructor() {
        this.url = "https://pokeapi.co/api/v2/pokemon/bulbasaur",
        this.key = ""
    };
};

const globalConfig = new Config();

// File to read from
const inputFile = 'files/testfile.csv';

let requests = [];
class Request {}

// Read file
const readInterface = createInterface({
    input: createReadStream(inputFile),
    output: null // useful in debugging -> // process.stdout,
});

// Read file line
readInterface.on('line', function(line) {
    let i = line.split(',');
    // Format and push Requests into requests here
});

// On file close
readInterface.on('close', function() {
    // Create a new txt file in the out/ folder with dataTimeFileName
    let f = 'out/' + dateTimeFileName + '.txt';
    let logStream = createWriteStream(f, {flags: 'a'}) as WriteStream;

    // Attempt requests in 1 second intervals
    requests.forEach((reqObj, i) => {
        setTimeout(() => {
            post(reqObj, logStream)
        }, i * 1000);
    });
});

// Post and add a line to the out file
function post(data, logStream: WriteStream) {
    let formattedData = createData(data);

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': formattedData.length,
            'x-apikey': globalConfig.key
        }
    };

    axios.post(
        globalConfig.url,
        formattedData,
        config
    ).then(response => {
        let msg = response.data;
        logStream.write(msg +'\n');
    }, error => {
        console.log(error);
    });
}

// Example get
function get() {
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': globalConfig.key
        }
    };

    axios.get(
        globalConfig.url,
        config
    ).then(response => {
        let msg = response.data;
        console.log(msg);
    }, error => {
        console.log(error);
    });
}

function createData(reqObj: Request) {
    const data = JSON.stringify(reqObj);
    return data;
}

function addZero(i) {
    (i < 10) ? i = "0" + i : '';
    return i;
}

function getDateTimePretty(date: Date) {
    return (+date.getMonth() + 1) + "/" + date.getDate() + ", " + date.getHours() + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
}

function getDateTimeFileName(date: Date) {
    return (+date.getMonth() + 1) + "." + date.getDate() + "-" + date.getHours() + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
}

// post('test', null);
get();
