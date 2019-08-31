const config = require('./config.json');
const eris = require('eris');
const fs = require('fs')
const util = require('util')
const readdirAsync = util.promisify(fs.readdir)

class Assyst {
    constructor() {
        this.prefix = config.client.prefix
        this.staff = { owners: config.client.staff.owners, admins: config.client.staff.admins, contributors: config.client.staff.contributors };
        this.emotes = config.client.emotes;
        this.bot = new eris.Client(config.client.tokens.bot, { disableEveryone: true, messageLimit: 100, defaultImageSize: 1024, defaultImageFormat: 'png' });
        this.info = { description: config.client.info.description, version: config.client.info.version };
        this.commands = {}
    };

    loadCommands() {
        readdirAsync('./src/commands').then(files => {
            files.forEach(file => {
                let commandFile = require('./src/commands/' + file)
                commandFile.command.names.forEach(n => {
                    let c = this.commands[n]
                    if (c) {
                        delete this.commands[n]
                        console.log('Command name clash detected in name ' + n + '. Removing.')
                    }
                })
                commandFile.command.names.forEach(n => { this.commands[n] = commandFile.command })
                commandFile.command.init(commandFile.info)
                if (commandFile.command.permissions > 2 || commandFile.command.permissions < 0) {
                    commandFile.command.permissions = 2
                    console.log('The command ' + commandFile.command.name[0] + ' has an invalid permission integer. Defaulted to 2.')
                }
                console.log('Loaded command ' + commandFile.command.names[0])
            })
        });
    }
};

const client = new Assyst()

module.exports = {
    Assyst,
    client
}