import fs from 'fs';
import { AvatarSaverForTable } from "@/app/api/avatar/saveavatar/route";

export async function GET(request, { params }) {
    const { id } = await params;
    const path = 'public/cache/avatar/';
    let userid = id;
    let imageBuffer;
    if(!fs.existsSync(`public/cache/avatar/${userid}.jpg`)) { 
        try{
            AvatarSaverForTable(userid)
        }
        catch(error){
            console.log(error);
        }
        userid = "default";
    }
    imageBuffer = fs.readFileSync(`${path}/${userid}.jpg`);
    //console.log(request.headers);  
    const headers = new Headers();
    //headers.set('Content-Type', 'image/jpeg'); 
    try{
        return new Response(imageBuffer, {
            status: 200,
            headers:{
                'Content-Type': 'image/jpeg',  
                'Content-Length': imageBuffer.length, 
            }
        })
    }
    catch(error){
        console.log(error);
    }
    return new Response(JSON.stringify({ message: `Avatar ID: ${id}` }), {
        status: 200,
        headers: headers,  // Attach the custom headers
    });
}