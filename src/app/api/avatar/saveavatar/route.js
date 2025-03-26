import fs from 'fs';
import fetch from 'node-fetch';
const savePath = 'public/cache/avatar';

export async function DownloadSteamPFP(avatarResponse, savePath, sid){
  console.log("Unloko, profile picture has to be downloaded");
  const writer = fs.createWriteStream(`${savePath}/${sid}.jpg`);
  await new Promise((resolve, reject) => {
      avatarResponse.body.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
}

export async function IfTheSame(sid, avatar)
{
  console.log('1');
  if(fs.existsSync(`${savePath}/${sid}.jpg`)){
    var avatarfetch = await fetch(avatar);
    var avatarfetch2 = await fetch(avatar);
    const buffer = await avatarfetch.arrayBuffer();
    var a_base = fs.readFileSync(`${savePath}/${sid}.jpg`);
    var b_base = Buffer.from(buffer).toString();
    if(a_base == b_base){ console.log("Profile pictures are the same. Ending task."); return;}
    console.log("Profile picture is different. Downloading a new one.");
    fs.rm(`${savePath}/${sid}.jpg`, (err) => {
      if(err){
        console.log(err);
        return;
      }
    })
    setTimeout(()=>{
      DownloadSteamPFP(avatarfetch2, savePath, sid);
    },1000)
    return;
  }
  else{
    var avatarfetch = await fetch(avatar);
    var avatar2 = avatarfetch;
    setTimeout(()=>{
      DownloadSteamPFP(avatar2, savePath, sid);
    },1000)
  }
}

export async function AvatarSaverForTable(sid)
{
  if(fs.existsSync(`${savePath}/${sid}.jpg`)){
    return;
  }
  try{
    const key = process.env.STEAM_API_KEY;
    let steamid = sid;
    const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`);
    const data = await response.json();
    const player = data.response.players[0];
  
    const avatarResponse = await fetch(player.avatarmedium);
    if(avatarResponse.ok){
      console.log("No profile picture for this player. Downloading.");
      DownloadSteamPFP(avatarResponse, savePath, sid)
    }
  }
  catch(error)
  {
    console.log(error + " --- " + sid);
  }

}