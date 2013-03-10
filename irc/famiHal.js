var irc = require('irc');

var config = {
    host: 'irc.freenode.com',
    port: 6667,
    nick: 'famiHal',
    username: 'famiHal',
    realname: 'famiHal9000',
    channels: ['#4amchan', '#familab']
};

var famiHalBot = new irc.Client(config.host, config.nick, {channels: config.channels})

famiHal.addListener("join", function(channel, who) {
    if(channel == "#4amchan")
        famiHal.say(channel, "Fuck you " + who);
    else
        famiHal.say(channel, "Hello " + who + ", welcome to #famiLab. I am your friendly automous bot famiHal. If you have any questions, feel free to ask.");
});

// Error Logging
famiHal.addListener('error', function(message) {
    console.log('error', mesage)
})


exports.famiHalBot = famiHal

