const { MessageEmbed } = require ('discord.js');

function getHighestRole(roles, search) {
  var found = null;
  for(var nm of search) {
    if(roles.includes(nm)) {
      if(found===null || (roles.indexOf(nm) > roles.indexOf(found))) {
        found = nm;
      }
    }
  }
  return found;
}

function sendEmbed(channel, color, title, description) {
  channel.send(new MessageEmbed().setColor(color).setTitle(title).setDescription(description));
}

const Red = 'ff4444';
const Green = '44ff44';

module.exports = async (bot, oldMember, newMember) => { 
  
   //try to make it cleaner kekw

  var removedRoles = oldMember._roles;
  var addedRoles = newMember._roles;
  removedRoles = removedRoles.filter( ( el ) => !newMember._roles.includes( el ) );
  addedRoles = addedRoles.filter( ( el ) => !oldMember._roles.includes( el ) );

  var nick = `<@${newMember.user.id}> (${newMember.user.username}#${newMember.user.discriminator})`;
  
  var changedRoles = removedRoles.concat(addedRoles);
  if(changedRoles.length!==0) {
    
    var staffRole = '844312739261448243';


    //from Builder to Owner (when adding roles please put them in the correct place)
    var staffRoles = ['833422416993976350', '749301636974772305', '777981057243938838', '832960714934845450', '707756849566318623', '778026883668246578', '711037865982951505', '844987824436412446', '707756851680378891'];

    const staffLogs = newMember.guild.channels.cache.get('833671894472458280');

    if(removedRoles.includes(staffRole)) {
      newMember.roles.remove(staffRoles);
    }

    const found = staffRoles.some(r=> newMember._roles.includes(r));

    if(newMember._roles.includes(staffRole)) {
      if(!found) {
        newMember.roles.remove(staffRole);
      }
    }

    const foundRemovedStaffRoles = staffRoles.some(r=> changedRoles.includes(r));
    if(foundRemovedStaffRoles && !found) {
      var highest = getHighestRole(staffRoles, removedRoles);
      sendEmbed(staffLogs, Red, 'Demotion', '<:PMC_Cross:847454244335648798> | ' + newMember.guild.roles.cache.get(highest).name + ` ➙ Member\n\n${nick}`);
      //await staffLogs.send('<:PMC_Cross:847454244335648798> | ' + newMember.guild.roles.cache.get(highest).name + ` ➙ Member\n\n${nick}`);
    }

    if(found) {

      var temp = [...newMember._roles];

      if(addedRoles.length) temp = temp.filter( ( el ) => !changedRoles.includes( el ) );
      else temp = temp.concat(changedRoles);

      var containing = getHighestRole(staffRoles, newMember._roles);
      var updated = getHighestRole(staffRoles, temp);

      var containingName = containing?newMember.guild.roles.cache.get(containing).name:"Member";
      var updatedName = updated?newMember.guild.roles.cache.get(updated).name:"Member";

      var shouldShow = containing===null || updated===null || 
              (removedRoles.length?staffRoles.indexOf(containing)<staffRoles.indexOf(updated):false) ||
              (addedRoles.length?staffRoles.indexOf(containing)>staffRoles.indexOf(updated):false);

      var emoji = addedRoles.length?'<:PMC_Yes:847454244771725332>':'<:PMC_Cross:847454244335648798>';

      if(shouldShow) {
        sendEmbed(staffLogs, addedRoles.length?Green:Red, addedRoles.length?'Promotion':'Demotion', `${emoji} | ${updatedName} ➙ ${containingName}\n\n${nick}`);
        //await staffLogs.send(`${emoji} | ${updatedName} ➙ ${containingName}\n\n${nick}`);
        newMember.roles.add(staffRole);
      }

      //<a:rejected:848571695266922497>
      //<a:checkmark:848573023966593034>
    }
    
    
  }
  
}