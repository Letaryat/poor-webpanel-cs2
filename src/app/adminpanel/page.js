import Cards from "./cards"
export default function AdminPanel() {
    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <div className="grid grid-cols-4 gap-4">
                    <Cards name={"Total Servers"} value={"5"} desc1={"Servers"} desc2={"test2"}/>
                    <Cards name={"Total Bans"} value={"1200"} desc1={"Servers"} desc2={"test2"}/>
                    <Cards name={"Total Mutes"} value={"700"} desc1={"Servers"} desc2={"test2"}/>
                    <Cards name={"Total Players"} value={"1000"} desc1={"Servers"} desc2={"test2"}/>
                </div>
            </main>
        </div>
    )
}