import Image
 from "next/image";
export function ShortNickname(value) {
    var strValue = String(value);
    if(strValue.length > 10)
    {
        return strValue.slice(0, 10) + "...";
    }
    return strValue;
}

export function StylePoints(value) {
    var strValue = String(value);
    const length = strValue.length;

    let Top, rest;

    if(value === null) {
        return "0";
    }
    if(length >= 5)
    {
        Top = strValue.slice(0, 2);
        rest = strValue.slice(2);

    }
    else if(length >= 4)
    {
        Top = strValue.slice(0, 1);
        rest = strValue.slice(1);
    }
    else{
        return(
            <p style={{fontStyle: "italic"}} className={CalculateColor(value) + ` ml-2 z-10 italic font-bold `}>{value}</p>
        )
    }
    return (
        <p style={{fontStyle: "italic"}} className={CalculateColor(value) + ` ml-2 z-10  font-bold `}>
        <span style={{marginRight: "2px"}} className={`text-md `}>{Top}</span>
        <span className="text-sm">{rest}</span>
        </p>
    )
}

export function CalculateColor(value) {
    if(value >= 0 && value < 5000)
        {
            return "premier_grey";
        }

        else if(value >= 5000 && value < 10000)
        {
            return "premier_cyan";
        }
        else if(value >= 10000 && value < 15000){
            return "premier_blue";
        }
        else if(value >= 15000 && value < 20000){
            return "premier_purple";
        }
        else if(value >= 20000 && value < 25000){
            return "premier_pink";
        }
        else if(value >= 25000 && value < 30000){
            return "premier_red";
        }
        else if(value >= 30000){
            return "premier_gold";
        }
}
export function CalculateBackground(value) {
            if(value >= 0 && value < 5000)
            {
                return <Image src={`/cache/ranks/premier/cs_rating_0.svg`} width={70} height={70} alt={'rank_0'}/>
            }

            else if(value >= 5000 && value < 10000)
            {
                return <Image src={`/cache/ranks/premier/cs_rating_1.svg`} width={70} height={70} alt={'rank_1'}/>
            }
            else if(value >= 10000 && value < 15000){
                return <Image src={`/cache/ranks/premier/cs_rating_2.svg`} width={70} height={70} alt={'rank_2'}/>
            }
            else if(value >= 15000 && value < 20000){
                return <Image src={`/cache/ranks/premier/cs_rating_3.svg`} width={70} height={70} alt={'rank_3'}/>
            }
            else if(value >= 20000 && value < 25000){
                return <Image src={`/cache/ranks/premier/cs_rating_4.svg`} width={70} height={70} alt={'rank_4'}/>
            }
            else if(value >= 25000 && value < 30000){
                return <Image src={`/cache/ranks/premier/cs_rating_5.svg`} width={70} height={70} alt={'rank_5'}/>
            }
            else if(value >= 30000){
                return <Image src={`/cache/ranks/premier/cs_rating_6.svg`} width={70} height={70} alt={'rank_6'}/>
            }
}
