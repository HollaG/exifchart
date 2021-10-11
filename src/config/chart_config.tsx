export const chartOptions: any = {
    // legend: {
    //     position: 'bottom'
    // },
    scales: {
        y: {
            stacked: true,
            ticks: {
                beginAtZero: true,
                precision: 0,
            },
            
        },

        x: {
            stacked: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0,
        },
    },
    maintainAspectRatio: false,
    // responsive: false,
    plugins: {
        zoom: {
            zoom: {
                limits: {
                    y: {
                        min: 'original'
                    }
                },
                wheel: {
                    enabled: true, // SET SCROOL ZOOM TO TRUE
                },
                pinch: {
                    enabled: true,
                },
                mode: "x",
                speed: 100,
            },
            pan: {
                enabled: true,
                mode: "x",
                speed: 100,
            },
        },
    },
};