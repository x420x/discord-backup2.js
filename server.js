const { Client } = require("discord.js");
const client = new Client({ fetchAllMembers: true });
const mongoose = require("mongoose");

let settings = {
    "token": "",
    "mongo": "mongodb+srv://rarelamp:sa1965156aSas@cluster0.efis5.mongodb.net/backup?retryWrites=true&w=majority",
    "guild": ""
};

let conf = {
    "name": "Backup Bot By Rare",
    "status": "dnd"
};

client.on("ready", () => {
  setInterval(() => roleBackup(), 5000);
});

   
client.on("ready", async () => {
    client.user.setPresence({
        activity: { name: conf.name },
        status: conf.status
    });
});

const Database = require("./Models/roles.js");

function roleBackup() {
    client.guilds.cache.get(settings.guild).roles.cache.forEach(role => {
        Database.findOne({ rolid: role.id }, async (err, res) => {
            if (!res) {
                let members = role.members.map(gmember => gmember.id);
                let backup = new Database({ rolid: role.id, members: members });
                backup.save();
            } else {
                res.members = role.members.map(gmember => gmember.id);
                res.save();
            }
        });
    });
};

client.on("roleDelete", async (role) => {
    await Database.findOne({ rolid: role.id }, async (err, res) => {
        if (!res) return;
        await role.guild.roles.create({ data: { name: role.name }}).then(roles => {
            res.members.map(member => {
                role.guild.members.cache.get(member).roles.add(roles.id);
            });
        });
    });
});

mongoose.connect(settings.mongo, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err.message));
client.login(settings.token).catch(err => console.log(err.message));