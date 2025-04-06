export default function Cards({name, value, desc1, desc2}){
    return(
        <div className="rounded-xl border bg-card flex flex-col p-2 h-[125px] justify-center">
        <div className="text-sm font-bold">
            {name}
        </div>
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <p className="font-bold text-3xl">
                    {value}
                </p>
                <p className="text-sm ">
                    {desc1}
                </p>
            </div>
            <p className="text-sm text-neutral-400">{desc2}</p>
        </div>
    </div>
    )
}