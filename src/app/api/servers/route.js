import {GameDig} from "gamedig";

export async function GET() {
    const servers = [
        {
            name: "Arena",
            type: "counterstrike2",
            host: "91.224.117.106",
            port: 27015,
        },
        {
            name: "Surf",
            type: "counterstrike2",
            host: "51.83.172.143",
            port: 23580,
        },
        {
            name: "1",
            type: "counterstrike2",
            host: "145.239.23.150",
            port: 27015,
        },
        {
            name: "2",
            type: "counterstrike2",
            host: "51.83.210.20",
            port: 27015,
        }
    ];

    try {
        const results = await Promise.all(
            servers.map(async (server) => {
                try {
                    const state = await GameDig.query({
                        type: server.type,
                        host: server.host,
                        port: server.port,
                        givenPortOnly: true,
                    });
                    return { ...server, state };
                } catch (error) {
                    return { ...server, state: null }; 
                }
            })
        );

        return Response.json(results);
    } catch (error) {
        return Response.json({ error: "Błąd pobierania serwerów" }, { status: 500 });
    }
}
