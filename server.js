/* jshint esversion: 6 */

console.log('Bot starting...')

const appRoot = require("app-root-path");
const logDir = appRoot + "/log";
const myConfig = require("./config.json");
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const request = require("request");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const cors = require('cors')
const process = require('process');
const {
  createLogger,
  format,
  transports
} = require("winston");
const {
  parse,
  stringify
} = require('flatted');
const secretKey = myConfig.secretKey;
const officerRoles = myConfig.officerRoles;
const {
  combine,
  timestamp,
  label,
  prettyPrint
} = format;
const app = express();
const server = http.createServer(app);
const bot = new Discord.Client({
  autoReconnect: true
});

app.set("serverPort", myConfig.serverPort);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set("trust proxy", true);

let possibleAppTags = [];

var corsOptionsAuthorization = {
  origin: true,
  credentials: true
}

process
  .on('unhandledRejection', (reason, promise) => {
    console.log('BOT Unhandled rejection at ', promise, `reason: ${reason.message}`);
    report2('BOT Unhandled rejection reason:' + reason.message);
    report2(promise);
  })
  .on('uncaughtException', err => {
    console.log(`BOT Uncaught Exception: ${err.message}`)
    console.log(err.stack)
    report2(`BOT Uncaught Exception: ${err.message}`)
    report2(err.stack);

  });

bot.on("ready", () => {

  bot.guilds.fetch(myConfig.guildID).then(() => {
    global.guild = bot.guilds.cache.get(myConfig.guildID);
  })

  //console.log(logChannel);

  //console.log(guild.channels);
  //let feedback_channel = guild.channels.find("name", "Feedback");
  //console.log(feedback_channel);

  //let parent_channel = guild.channels.find("name", "Trials");

  //console.log(parent_channel);
  console.log("I am ready!");
});

bot.on("message", message => {
  if (message.author.bot === false) {

    // get member object from message
    guild.members.fetch(message.member).then((member) => {
      //console.log(member);

      // --- Memes ---
      if (message.content === "!daemios app") {
        message.channel.send("https://baddies.org/keep_forever/Swagga%20App.png").catch(() => {});
      }

      if (message.content === "!daemios roll") {
        message.channel.send("https://www.youtube.com/watch?v=Op2aUjmGTOM").catch(() => {});
      }

      if (message.content === "!poverty") {
        message.channel.send("https://www.youtube.com/watch?v=0U4ieafzfg8").catch(() => {});
      }

      if (message.content === "!gatekeeper") {
        message.channel.send("https://www.youtube.com/watch?v=WQLKS8Z31Es").catch(() => {});
      }

      if (message.content === "!notscalysswamp") {
        message.channel.send("https://i.imgur.com/sQjutsC.gifv").catch(() => {});
      }

      if (message.content === "!myrien tryhard") {
        message.channel.send(
          "https://clips.twitch.tv/HilariousHelplessBobaKeepo"
        ).catch(() => {});
      }

      // --- App Commands ---
      if (message.channel.parent.name === "applications") {
        if (message.content === "!debug message") {
          message.channel.send(`\`\`\`Message\`\`\``);
        }

        if (message.content === "!ping") {
          message.channel.send(`\`\`\`Pong\`\`\``);
        }

        if (message.content === "!debug linetest") {
          report2(
            "test1 \n" +
            "test2"
          )
        }

        if (message.content === "!debug checkrole") {
          //console.log(stringify(message.guild.fetchMember(message.author)));
          //console.log(message);
          report2("test");
          //console.log(member);
          testRole = checkOfficer(member, null);
          try {
            if (testRole) {
              message.channel.send(`\`\`\`Officer check passed\`\`\``);
            } else {
              message.channel.send(`\`\`\`Officer check failed\`\`\``);
            }
          } catch (e) {
            report2(e.stack);
          }

          //console.log(member.roles.array());
          //console.log(stringify(localmember.roles.array()));
          //logChannel.send(`\`\`\`` + stringify(localmember.roles.array()) + `\`\`\``);
          //logChannel.send(`\`\`\`` + stringify(message) + `\`\`\``);
        }

        if (message.content === "!debug channeltest") {
          report(`\`\`\`Attempting to create channel DEBUG through the bot using createApplicantUserChannel()\`\`\``);
        }

        if (message.content === "!debug length") {
          report(`\`\`\`possibleAppTags length: ${possibleAppTags.length}\`\`\``);
        }

        if (message.content === "!debug pendingapps") {
          if (possibleAppTags.length == 0) {
            report(`\`\`\`No pending apps found\`\`\``);
          } else {
            // Iterate through possible apps
            report(`\`\`\`Listing pending apps - \`\`\``);
            for (let i = 0; i < possibleAppTags.length; i++) {
              let sendTextDebug = JSON.stringify(possibleAppTags[i]);
              report(`\`\`\`${sendTextDebug}\`\`\``);
            }
          }

        }

        if (message.content === "!debug status") {
          message.channel
            .send(`\`\`\`I'm running\`\`\``)
            .catch(() => {});
        }

        if (message.content === "!appdebug backtrace") {
          try {
            functionundertest(); // this should fail
          } catch (e) {
            //console.error(e);
            report2(e.stack);
          }
        }

        let applicantMember = null;

        try {
          // TODO

          // If the sender is an officer
          if (checkOfficer(member, message)) {

            if (message.content === "!debug config") {
              report2(JSON.stringify(myConfig, null, 2));
            }

            if (message.content === "!app archive") {
              // channel category we are going to make a channel under
              let archiveCategory = "archive";
              // get the channel object for the name above
              //let archiveChannel = guild.channels.find("name", archiveCategory);
              let archiveChannel = bot.channels.fetch(myConfig.archive_categoryID)
                .catch((e) => {
                  report2(e.stack)
                });

              report(`\`\`\`Moving ${message.channel.name} to archive.\`\`\``).catch((e) => {
                report2(e.stack)
              });

              message.channel.send(
                `Moving channel to archive.`
              ).catch((e) => {
                report2(e.stack)
              });
              message.channel.setParent(archiveChannel);
            }

            if (message.content === "!app help") {
              // this is here in case someone forgets how to use the !app commands
              message.channel.send(
                '\`\`\`"!app accept" accepts the app, moves the channel to feedback, sends them a DM, and then promotes them to the Trial rank in Discord.\n' +
                '"!app archive" moves the channel to the archive category with no user role changes.\n' +
                '"!app decline" declines the app by moving the channel to archive, sends them a DM, and then removes the applicant role in Discord.\`\`\`'
              ).catch((e) => {
                report2(e.stack)
              });
            }

            if (message.content === "!app accept") {
              //let welcomeChannel = guild.channels.find(
              //  "name",
              //  "guild-announcement"
              //);
              let welcomeChannel = bot.channels.fetch(myConfig.welcome_channelID);

              applicantMember = findApplicantByChannel(message);

              // send DM with app status
              applicantMember.send(
                "Hey! You've been accepted! Take a look at your application channel for instructions. Welcome to Efficiency!"
              ).catch((e) => {
                report3("no user to send message to");
                report2(e.stack);
              });

              // Lets accept the app, and do a bunch of stuff
              /*
                - Send channel message about the app being accepted
                - Move the channel to feedback category
                - Change name on channel to strip server name
                - Remove permissions for members and robot testers
                - Remove applicant role from user
                - Add trial role to user
              */
              message.channel.send(
                `Hey ${applicantMember.user}! Congratulations, you've been accepted into Efficiency! ` +
                `You can whisper anyone at raider rank or up for an invite, or with any questions ` +
                `about the process. \n\nIf you are leaving a guild, we think it's courteous to give ` +
                `them a heads up if you haven't already, and we're flexible about you transferring later ` +
                `if your guild needs some time. It wont affect your acceptance if you need a week or ` +
                `two. \n\nFinally, please take a look at our ${welcomeChannel} channel to review what we ` +
                `expect from you. The things in that channel are critical to your success during your trial period.`
              ).catch((e) => {
                report2(e.stack)
              });

              // Move channel to feedback  ---------

              // get the channel object for the name above
              bot.channels.fetch(myConfig.feedback_categoryID)
                .then((feedbackChannel) => {
                  //console.log(feedbackChannel);

                  // logging to bot-testing
                  report(
                    `\`\`\`` +
                    `Moving ${message.channel.name} to feedback becuase the app was accepted. \n` +
                    `Removing applicant role on ${applicantMember.nickname}. \n` +
                    `Adding member role on ${applicantMember.nickname}. ` +
                    `\`\`\``
                  )

                  // send message to the channel
                  message.channel.send(
                    `Moving channel to feedback and removing permissions for regular members.`
                  ).catch((e) => {
                    report2(e.stack)
                  });

                  // move channel to new parent
                  message.channel.setParent(feedbackChannel, "App Accepted - " + message.channel.name)
                    .then(() => {
                      // change channel name to just be character name
                      let serverPattern = '/-.*/g';
                      let newChannelName = message.channel.name.replace(serverPattern, "");
                      message.channel.setName(newChannelName, "App Accepted - " + message.channel.name)
                        .then(() => {
                          // remove members permissions
                          message.channel
                            .createOverwrite(myConfig.memberRoleID, {
                              SEND_MESSAGES: false,
                              READ_MESSAGES: false,
                              READ_MESSAGE_HISTORY: false
                            }).catch((e) => {
                              report2(e.stack)
                            });

                          // remove trial permissions
                          message.channel
                            .createOverwrite(myConfig.trialRoleID, {
                              SEND_MESSAGES: false,
                              READ_MESSAGES: false,
                              READ_MESSAGE_HISTORY: false
                            }).catch((e) => {
                              report2(e.stack)
                            });
                        });
                    });

                  // remove the applicant role
                  applicantMember
                    .roles.remove(myConfig.applicantRoleID)
                    .catch((e) => {
                      report2(e.stack)
                    });
                  report3("Removed " + myConfig.applicantRoleID + " on " + applicantMember.nickname);

                  // add the trial role 
                  applicantMember
                    .roles.add(myConfig.trialRoleID)
                    .catch((e) => {
                      report2(e.stack)
                    });
                  report3("Added " + myConfig.trialRoleID + " on " + applicantMember.nickname);

                }).catch((e) => {
                  report2(e.stack)
                });

            }

            if (message.content === "!app trial") {

              applicantMember = findApplicantByChannel(message);
              //applicantMember2 = guild.members.cache.get(applicantMemberID2)
              //console.log("member is " + applicantMember2.displayName);

              // remove the applicant role
              applicantMember
                .roles.remove(myConfig.applicantRoleID)
                .catch((e) => {
                  report2(e.stack)
                });
              message.channel.send("Removed " + myConfig.applicantRoleID + " on " + applicantMember.nickname);

              // add the trial role 
              applicantMember
                .roles.add(myConfig.trialRoleID)
                .catch((e) => {
                  report2(e.stack)
                });
              message.channel.send("Added " + myConfig.trialRoleID + " on " + applicantMember.nickname);

            }

            if (message.content === "!app applicant") {

              applicantMember = findApplicantByChannel(message);
              // remove the trial role
              applicantMember
                .roles.remove(myConfig.trialRoleID)
                .catch((e) => {
                  report2(e.stack)
                });
              message.channel.send("Removed " + myConfig.trialRoleID + " on " + applicantMember.nickname);

              // add the applicant role 
              applicantMember
                .roles.add(myConfig.applicantRoleID)
                .catch((e) => {
                  report2(e.stack)
                });
              message.channel.send("Added " + myConfig.applicantRoleID + " on " + applicantMember.nickname);
            }

            if (message.content === "!app decline") {
              // Lets decline the app and do a few things
              /*
                - Send DM to user
                - Sends message to channel
                - Moves channel to archive category
                - Removes applicant role on the user
              */
              applicantMember = findApplicantByChannel(message);

              // send DM with app status
              applicantMember.send(
                `Hi ${applicantMember.user}. As you know by now, we've declined your application and this message ` +
                `is to alert you that we have closed your application. You won't be removed from our Discord, ` +
                `and we invite you to stay as long as you want. Additionally, if the issues mentioned in your app ` +
                `are resolved at some point in the future, we'd love to have you re-apply.`
              ).catch((e) => {
                report2(e.stack)
              });

              // lets archive the channel under the archive header instead of deleting it

              // get the channel object for the name above
              bot.channels.fetch(myConfig.archive_categoryID)
                .then((archiveChannel) => {

                  report2(
                    `Moving ${message.channel.name} to archive becuase the app was declined. \n` +
                    `Removing applicant role on ${applicantMember.user} becuase the app was declined.`
                  );

                  message.channel.setParent(archiveChannel, "App Declined - " + message.channel.name).catch(e => {
                    report2(e.stack);
                    message.channel.send(`Unable to move channel to archive`);
                  });

                  applicantMember.roles.remove(myConfig.applicantRoleID).catch(e => {
                    report2(e.stack);
                    report2('Removing role failed for applicant')
                    message.channel.send(`Unable to remove role from applicant`);
                  });

                  // Give feedback on command receipt
                  message.channel.send(`App declined`).catch((e) => {
                    report2(e.stack)
                  });
                });

            }

          }
        } catch (e) {
          report2(e.stack);
        }
      }
    });
  }
});

bot.on("guildMemberAdd", member => {
  //let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  if (guild.available) {
    for (let i = 0; i < possibleAppTags.length; i++) {
      if (
        member.user.username === possibleAppTags[i][0] &&
        member.user.discriminator === possibleAppTags[i][1]
      ) {
        console.log(
          member.user.id +
          " username of " +
          member.user.username +
          "#" +
          member.user.discriminator +
          " matched user we are looking for " +
          possibleAppTags[i][0] +
          "#" +
          possibleAppTags[i][1]
        );
        //member.send(`@${member.user.username}#${member.user.discriminator} We've been looking for you, welcome to the Efficiency US-Tichondrius discord server. You'll be automatically moved to your application discussion shortly.`);
        createApplicantUserChannel(member, i);
      }
    }
  }
});

const checkOfficer = (member, message) => {
  //console.log(member.roles);
  //message.channel.send('ran check roles');

  if (
    member.roles.cache.some(role =>
      (officerRoles.includes(role.id))
    )
  ) {
    // has one of the roles
    //message.channel.send(`${member.user} has sufficent roles to run "officer" level commands.`);
    return true;
  } else {
    // has none of the above roles
    //message.channel.send(`${member.user} DOES NOT have sufficent roles to run "officer" level commands.`);
    return false;
  }
}

const checkUserOnServer = (discordName, discordDiscriminator) => {

  let members = guild.members.cache.array();
  //members.filter(m => m.presence.status === "online");
  if (guild.available) {
    for (let i in members) {
      member = members[i];
      //console.log(member.user.id + " | " + member.user.username + "#" + member.user.discriminator + " - " + member.presence.status);
      if (
        member.user.username === discordName &&
        member.user.discriminator === discordDiscriminator
      ) {
        console.log(
          member.user.id +
          " username of " +
          member.user.username +
          "#" +
          member.user.discriminator +
          " matched against " +
          discordName +
          "#" +
          discordDiscriminator +
          " already on the server"
        );

        //member.send(`@${member.user.username}#${member.user.discriminator} We've been looking for you, welcome to the Efficiency US-Tichondrius discord server. You'll be automatically moved to your application discussion shortly.`);
        //createApplicantUserChannel(member, i);
        //console.log(member);
        return member;
      }
    }
  }
  return false;
}

const findApplicantByChannel = (message) => {
  // Get the member object from the channel name. Assumes channel name = display name.
  // DON'T EVER CHANGE THE APPLICANT NICKNAME OTHERWISE THIS WON'T WORK. In the future we might be able to save the ID to a DB and work with that.
  let channelMembers = message.channel.members;
  let applicantMemberID = null;
  var applicantMember;
  var member = null;

  for (let i in channelMembers.array()) {
    member = channelMembers.array()[i];
    //console.log(member.displayName.toLowerCase());
    if (member.displayName.toLowerCase() === message.channel.name.toLowerCase()) {
      applicantMemberID = member.id;
      //console.log('found ' + member.displayName.toLowerCase() + ' vs ' + message.channel.name.toLowerCase());
      break;
    }
  }

  applicantMember = guild.members.cache.get(applicantMemberID);
  //report2(applicantMember);
  return applicantMember;
}

const createChannel = (name, type, permissions, parent) => {

  guild
    .createChannel(name, type, permissions)
    .catch(e => {
      report2(e.stack);
      report2('failed to make channel' + name)
    })
    .then(channel => {
      channel
        .setParent(parent)
        .then(() => {
          return channel
        })
    })

}

const createApplicantUserChannel = (member, i) => {

  if (guild.available) {
    const channelName = possibleAppTags[i][2];
    const formattedTag = possibleAppTags[i][2];

    // we check for spaces and ' in nicks and channel names and remove them
    let channelNameFormatted = channelName.replace(/ /g, "-").replace(/'/g, "").toLowerCase();
    let nicknameFormatted = possibleAppTags[i][2].replace(/ /g, "-").replace(/'/g, "");

    // gets if the channel exists or not
    //let channelNameCheck = guild.channels.find("name", channelNameFormatted);

    let channelNameCheck = null;

    // debug logging bot #bot-testing channel
    report(`\`\`\`Attempting to create channel ${channelNameFormatted} through the bot using createApplicantUserChannel()\`\`\``);
    bot.channels.fetch(myConfig.app_categoryID)
      .then((appCategory) => {
        //console.log(channelNameCheck);

        if (channelNameCheck != null) {
          console.log(
            "Channel for this name (" +
            channelNameFormatted +
            ") already exists. Prompting channel for an update."
          );
          return false;
          channelNameCheck
            .send(
              `${
            member.user
          }, there was an attempt to post a new app with the same name as this channel. ACCESS DENIED. Please type \"!app yes\" to post an updated version here if this was your intention.`
            )
            .then(() => {
              channelNameCheck
                .awaitMessages(m => m.content === "!app yes", {
                  max: 1,
                  time: 30000,
                  errors: ["time"]
                })
                .then(collected => {
                  output = "";
                  for (
                    let j = 0, len = possibleAppTags[i][3].length; j < len; j++
                  ) {
                    output += "**" + possibleAppTags[i][3][j]["name"] + "** \n";
                    output += possibleAppTags[i][3][j]["value"] + "\n\n";
                  }
                  channelNameCheck
                    .send(output, {
                      split: true
                    })
                    .then(() => {
                      possibleAppTags.splice(i, 1);
                    })
                    .catch(e => {
                      report2(e.stack);
                      console.log(e);
                    });
                })
                .catch(() => {
                  console.log(
                    "There was no collected message that passed the filter within the time limit."
                  );
                  channelNameCheck
                    .send(
                      "We did not hear back from you in a timely manner. Please post an updated app on the website again and then check back here."
                    )
                    .then(() => {})
                    .catch(e => {
                      report2(e.stack);
                      console.log(e);
                    });
                  possibleAppTags.splice(i, 1);
                });
            })
            .catch(e => {
              report2(e.stack);
              console.log(e);
            });
          return false;
        }

        guild
          .channels.create(channelName, "text")
          .then(channel => {
            channel
              .setParent(appCategory)
              .then(() => {
                //channel.send(`@everyone New application please review.`);
                member
                  .roles.add(myConfig.applicantRoleID)
                member
                  .setNickname(nicknameFormatted)
                channel
                  .createOverwrite(channel.guild.roles.everyone, {
                    VIEW_CHANNEL: false
                  });
                channel
                  .createOverwrite(member, {
                    SEND_MESSAGES: true,
                    READ_MESSAGES: true,
                    EMBED_LINKS: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true,
                    VIEW_CHANNEL: true
                  });
                channel
                  .createOverwrite(myConfig.memberRoleID, {
                    SEND_MESSAGES: true,
                    READ_MESSAGES: true,
                    EMBED_LINKS: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true,
                    VIEW_CHANNEL: true
                  });
                channel
                  .createOverwrite(myConfig.trialRoleID, {
                    SEND_MESSAGES: true,
                    READ_MESSAGES: true,
                    EMBED_LINKS: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true,
                    VIEW_CHANNEL: true
                  });
                channel
                  .send(`${member.user}, the rest of your application will be carried out here. You don't have to ` +
                    `worry about the site anymore. We'll message you here with any questions we have. Welcome to ` +
                    `the Efficiency discord!`)
                  // Dump the application questions / answers
                  .then(() => {
                    output = "\n";
                    for (
                      let j = 0, len = possibleAppTags[i][3].length; j < len; j++
                    ) {
                      if (possibleAppTags[i][3][j]["name"] != undefined) {
                        output += "**" + possibleAppTags[i][3][j]["name"] + "** \n";
                      }
                      output += possibleAppTags[i][3][j]["value"] + "\n\n";
                    }
                    channel
                      .send(output, {
                        split: true
                      })
                      .then(() => {
                        possibleAppTags.splice(i, 1);
                      })
                  });
              });
          })
          .catch(e => {
            report2(e.stack);
            console.log(e);
          });
      });
  }

}

const report3 = (message) => {
  console.log(message);
}

const report2 = (message) => {
  logChannel = bot.channels.fetch(myConfig.log_channel)
    .then((lc) => {
      console.log(message);
      lc
        .send("\`\`\`" + message + "\`\`\`").catch(() => {
          console.error("error")
        });
    });
}

const report = (message) => {
  logChannel = bot.channels.fetch(myConfig.log_channel)
    .then((lc) => {
      console.log(message);
      lc
        .send(message).catch(() => {
          console.error("error")
        });
    });
}

app.options('*', cors())

app.post("/discord/receiveUserInfoFromApp", cors(corsOptionsAuthorization), (request, response) => {
  const {
    method,
    url
  } = request;
  const {
    headers
  } = request;

  console.log("Request received from client" + request);

  // Alias data from client
  const appData = request.body.app_data;
  const discordName = request.body.discord_name;
  const discordDiscriminator = request.body.discord_discriminator;
  const channelName = request.body.channel_name;

  //logChannel = guild.channels.find('name', myConfig.log_channel);
  report(`-------------------------------------------------------`);
  report(
    `\`\`\`` +
    `Received information from the website to create an application using receiveUserInfoFromApp() \n` +
    `Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName.replace(/ /g, "-").replace(/'/g,"").toLowerCase()}` +
    `\`\`\``
  );
  //logChannel.send(`\`\`\`Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName.replace(/ /g, "-").toLowerCase()}\`\`\``).catch(() => {});

  // Authenticate token
  let authHeader = request.headers.authorization.split(" ");
  let token = authHeader[1];
  try {
    let decoded = jwt.verify(token, myConfig.secretKey);
    if (decoded) {
      console.log("Verified token");
    }
  } catch (err) {
    console.log(err);
    //logChannel.send(`\`\`\`JWT invalid. Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName}\`\`\``).catch(() => {});
    //logChannel.send(`\`\`\`${err}\`\`\``).catch(() => {});
    report(
      `\`\`\`` +
      `JWT invalid. Discord Name: ${discordName}#${discordDiscriminator}, Channel Name: ${channelName} \n` +
      `${err}` +
      `\`\`\``
    )
    response.send("Invalid Token");
  }

  // If guild is available
  if (guild.available) {
    // Initialize duplicate variable
    dupe = false;

    //iterate through existing array to see if the app is a duplicate, if so replace it

    // Iterate through possible apps
    for (let i = 0; i < possibleAppTags.length; i++) {
      if (
        discordName === possibleAppTags[i][0] &&
        discordDiscriminator === possibleAppTags[i][1]
      ) {
        console.log(
          "Dupe app already received with that ID " +
          discordName +
          "#" +
          discordDiscriminator +
          ". We should replace the app."
        );
        possibleAppTags[i] = [
          discordName,
          discordDiscriminator,
          channelName,
          appData
        ];
        response.send(
          JSON.stringify({
            success: true
          })
        );
        dupe = true;
      }
    }

    if (!dupe) {
      possibleAppTags.push([
        discordName,
        discordDiscriminator,
        channelName,
        appData
      ]);
      response.setHeader("Content-Type", "application/json");
      //console.log(response);
      try {
        try {
          member = checkUserOnServer(discordName, discordDiscriminator);
        } catch (err) {
          report2(err.stack);
          console.log(err);
        }
        if (member != false) {
          console.log(
            "User " +
            discordName +
            "#" +
            discordDiscriminator +
            " already on the server. Sending create channel data."
          );
          i = possibleAppTags.length - 1;
          try {
            createApplicantUserChannel(member, i)
          } catch (e) {
            report2(e.stack);
          }
        } else {
          report3(`User not found on server NOT creating channel yet. ${discordName}#${discordDiscriminator}`).catch(() => {});
          throw "Member not found on server. Continuing.";
        }
      } catch (err) {
        console.log(err);
        report2(err.stack);
      }

      response.send(
        JSON.stringify({
          success: true
        })
      );
    }
  }
});

app.post("/discord/checkUserOnServer", cors(corsOptionsAuthorization), (request, response) => {
  const {
    method,
    url
  } = request;
  const {
    headers
  } = request;

  //console.log("--- HEADERS ---");
  //console.log(headers);
  //console.log("--- METHOD ---");
  //console.log(method);
  //console.log("--- URL ---");
  //console.log(url);
  //console.log("--- BODY ---");
  //console.log(request.body);

  const discordName = request.body.discord_name;
  const discordDiscriminator = request.body.discord_discriminator;

  // Initialize found member & whether the user is found or not
  let member = false;
  let found = false;

  report3('Looking for ' + discordName + '#' + discordDiscriminator + '.');

  //try {

  try {
    member = checkUserOnServer(discordName, discordDiscriminator);
  } catch (err) {
    console.log("Error running checkUserOnServer");
    report2(err.stack);
  }

  // If the member is found
  if (member != false) {
    console.log(
      "User " +
      discordName +
      "#" +
      discordDiscriminator +
      " found on server. Reporting to client."
    );

    response.setHeader("Content-Type", "application/json");
    found = true;
    response.send(
      JSON.stringify({
        success: found
      })
    );
  } else {
    response.sendStatus(404);
    console.log("Member " + discordName + "#" + discordDiscriminator + " not found on server. Continuing.");
  }
});

app.get("/discord/sendJWT", cors(), (request, response) => {
  const {
    method,
    url
  } = request;
  const {
    headers
  } = request;

  // get the client ip; since we are behind CF we need to check those headers as well
  let ip =
    request.headers["cf-connecting-ip"] ||
    (request.headers["x-forwarded-for"] ?
      request.headers["x-forwarded-for"].split(",")[0] :
      null) ||
    request.connection.remoteAddress;

  // If the address is ipv4, strip ipv6 code, else continue
  if (/^::ffff:(.*)$/.test(ip)) {
    ip = ip.replace("::ffff:", "");
  }

  let payload = {
    "user-agent": headers["user-agent"],
    ip: ip
  };

  try {

    var token = jwt.sign(payload, myConfig.secretKey, {
      expiresIn: 259200 // expires in 72 hours
      //expiresIn: 259200 // expires in 72 hours
    });
    console.log(
      "Created token for ip " + ip + " user agent " + headers["user-agent"]
    );

  } catch (err) {
    console.log(err);
    response.send("");
    report2(err.stack);
  }

  response.setHeader("Content-Type", "application/json");
  response.send(
    JSON.stringify({
      token: token
    })
  );
});

bot.login(myConfig.discordKey);

server.listen(app.get("serverPort"));
console.log("Listening on port", app.get("serverPort"));