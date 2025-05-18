import SharptimerPlayerHeader from "./header";
import SharpTimerPlayerData from "./playerdata";

export default async function SharpTimerProfile({ params, searchParams }) {
    const { id } = await params;
    const serverid = await searchParams;
    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <SharptimerPlayerHeader id={id}/>
                <SharpTimerPlayerData id={id}/>
            </main>
        </div>
    )
}