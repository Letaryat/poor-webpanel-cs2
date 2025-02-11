'use client'
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, RadialLinearScale, ArcElement, } from "chart.js";
import { Line, Pie, Radar} from "react-chartjs-2";
ChartJS.register(CategoryScale, ArcElement, LineElement, LinearScale, PointElement, RadialLinearScale, Title, Tooltip, Legend, Filler);


export default function PlayerTimeChart({ tt, ct, spec })
{
    const data = {
        labels: ['Terrorist', 'CT', 'Spectator'],
        datasets: [
          {
            label: 'Minutes',
            data: [tt, ct, spec],
            backgroundColor: [
              'rgba(255, 182, 73, 0.2)',
              'rgba(73, 121, 255, 0.2)',
              'rgba(219, 219, 219, 0.2)',
            ],
            borderColor: [
                'rgba(255, 182, 73, 1)',
                'rgba(73, 121, 255, 1)',
                'rgba(219, 219, 219, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

    return(
            <Pie data={data}/>
    )
}