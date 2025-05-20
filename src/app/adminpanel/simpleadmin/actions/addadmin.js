'use server'

export async function submitAdmin(formData)
{
    const steamid = formData.get("steamid");
    const name = formData.get('name');
    const permission = formData.get('permission');
    const immunity = formData.get('immunity');
    const duration = formData.get('duration');
    const allservers = formData.get('allservers');
    console.log(allservers);
}