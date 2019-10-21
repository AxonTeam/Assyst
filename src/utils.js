const fs = require('fs');
const promisifyWrite = require('util').promisify(fs.writeFile);
const promisifyUnlink = require('util').promisify(fs.unlink);
const superagent = require('superagent');
class Utils {
    elapsed(value) {
        const date = new Date(value);
        const elapsed = { days: date.getUTCDate() - 1, hours: date.getUTCHours(), minutes: date.getUTCMinutes(), seconds: date.getUTCSeconds() };
        return elapsed;
    }

    snowflakeToTime(snowflake) {
        const Epoch = 1420070400000;
        // eslint-disable-next-line no-magic-numbers
        const Binary = (parseInt(snowflake, 10) ).toString(2).padStart(64, '0');
        // eslint-disable-next-line no-magic-numbers
        return parseInt(Binary.substring(0, 42), 2) + Epoch;
    }

    getRandomColour() {
        const letters = '0123456789ABCDEF';
        let color = '0x';
        for (let i = 0; i < 6; i++) {
            // eslint-disable-next-line no-magic-numbers
            color += letters[Math.floor(Math.random() * 16)];
        }
        return parseInt(color);
    }

    resolveFlags(args) {
        const flags = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i].startsWith('-') ) {
                flags.push( { flagName: args[i].substr(1, args[i].length), flagContent: null } );
            } else if (args[i].startsWith('--') ) {
                flags.push( { flagName: args[i].substr(2, args[i].length), flagContent: args[i + 1] } );
            }
        }
        return flags;
    }

    removeFlags(args) {
        args.forEach(arg => {
            if (arg.startsWith('--') || arg.startsWith('-') ) {
                args.splice(args.indexOf(arg), 1);
            }
        } );
        return args;
    }

    divideArray(array, size) {
        const dividedArray = [];
        while (array.length > size) {
            dividedArray.push(array.slice(0, size) );
            array.splice(0, size);
        }
        if (array.length > 0) {
            dividedArray.push(array);
        }
        return dividedArray;
    }

    async uploadToFilesGG(text, filename) {
        const data = new Uint8Array(Buffer.from(text) );
        await promisifyWrite(`${__dirname}/${filename}`, data);
        const response = await superagent.post('https://api.files.gg/files').type('form').attach('file', `${__dirname}/${filename}`);
        await promisifyUnlink(`${__dirname}/${filename}`);
        return response.body.urls.main;
    }

    async getChiasmAliases(ctx) {
        const response = await ctx.request('http://152.89.106.191:4840/languages', 'GET');
        const aliasesArrays = Object.values(JSON.parse(response.text) ).map(i => i.aliases);
        const aliases = [];
        aliasesArrays.forEach(array => {
            array.forEach(value => {
                aliases.push(value);
            } );
        } );
        return aliases;
    }

    async requestAPI(url, type, set, args) {
        if (type.toUpperCase() === 'GET') {
            const response = await superagent.get(url);
            return response;
        } if (type === 'POST') {
            const response = await superagent
                .post(url)
                .set(set)
                .send(args);
            return response;
        }
        throw new Error('You must either GET or POST with superagent');
    }
}

module.exports = {
    Utils,
};
