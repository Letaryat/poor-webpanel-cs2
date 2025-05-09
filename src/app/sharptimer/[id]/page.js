export default async function SharpTimerProfile({ params, searchParams }) {
    const { id } = await params;
    const serverid = await searchParams;
    return(
        <div>Profil uzytnika {id}</div>
    )
}