import NextAuth from "next-auth";
import Steam from "next-auth-steam";

async function auth(req, ctx) {
  return NextAuth(req, ctx, {
    providers: [
      Steam(req, {
        clientSecret: process.env.STEAM_API_KEY
      })
    ],
    callbacks: {
      // Aktualizacja tokena JWT
      async jwt({ token, account }) {
        if (account) {
          token.steamid = account.providerAccountId; // SteamID użytkownika
        
          try {
            const response = await fetch(
              `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${token.steamid}`
            );
            const data = await response.json();
            const player = data.response.players[0];

            if (player) {
              token.profile = {
                steamid: token.steamid,
                personaName: player.personaname,
                avatar: player.avatarfull,
                realName: player.realname || null,
                profileUrl: player.profileurl,
                country: player.loccountrycode || null
              };
            }
          } catch (error) {
            console.error("Błąd podczas pobierania danych z API Steam:", error);
          }
          finally{
            console.log(token);
          }
        }
        return token;
      },
      
      // Aktualizacja sesji
      async session({ session, token }) {
        session.user = {
          ...session.user,
          steamid: token.profile?.steamid || token.steamid,
          profile: token.profile || null
        };
        console.log(session);
        return session;
      }
    }
  });
}

export { auth as GET, auth as POST };
