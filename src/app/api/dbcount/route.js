export async function GET()
{
    try{
        const dbs = JSON.parse(process.env.ZENITH_DATABASE || "{}");
        const dbsCount = Object.entries(dbs).map(([id, db]) => ( {
            id,
            name: db.name
        }));
        return new Response(JSON.stringify(dbsCount), {
            status: 200,
            headers: {"Content-Type": "application/json"}
        });
    } catch (error){
        return new Response(JSON.stringify({ error: `Error with count dbs ${error}`}), {
            status: 500,
            headers: {"Content-Type": "application/json"}
        });
    }
}