import puppeteer from 'puppeteer';
import fs from 'fs';

import { uploadFile } from './s3.js'


function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
        return new Date(
            new Date(date).toLocaleString('en-US', {
                timeZone,
            }),
        );
    }
    return new Date(
        date.toLocaleString('en-US', {
            timeZone,
        }),
    );
}

function prepare_string(integer) {
    if (integer < 10) {
        return "0" + integer.toString()
    }
    return integer.toString()
}


async function takeScreenshot() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--use-gl=egl'],
    });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/view", { waitUntil: 'networkidle2' });

    const date = changeTimeZone(new Date(), 'America/Lima');

    const [month, day, year] = [prepare_string(date.getMonth() + 1), prepare_string(date.getDate()), prepare_string(date.getFullYear())];
    const [hour, minutes, seconds] = [prepare_string(date.getHours()), prepare_string(date.getMinutes()), prepare_string(date.getSeconds())];

    const extension = '.png'
    const namefile = hour + "_" + minutes + "_" + seconds + extension;
    const folder = year + "_" + month + "_" + day;
    const directory = './Storage/' + folder + '/' + namefile;
    const directStorage = folder + '/' + namefile;

    if (!fs.existsSync('./Storage/' + folder)) {
        fs.mkdirSync('./Storage/' + folder, {
            recursive: true
        });
    }

    console.log("Creating file ... " + namefile);
    const buffer = await page.screenshot({
        path: directory
    });
    const file = {
        tempFilePath: directory,
        name: directStorage,
    };

    await page.close();
    await browser.close();
    uploadFile(file);


}

export function process(n, interval) {
    const date = changeTimeZone(new Date(), 'America/Lima');
    var interval_i = 60 - date.getSeconds()
    var i = 0;

    while (i < n) {
        (function (i) {
            setTimeout(function () {
                takeScreenshot();
            }, (interval_i + interval * i) * 1000)
        })(i++)
    }
}

