document.addEventListener("DOMContentLoaded", function() {
    const bulbStatus = document.getElementById("bulb-status");
    const toggleBtn = document.getElementById("toggle-btn");
    const analysisSection = document.getElementById("analysis-section");
    const imgElement = document.getElementById("bulb");
    const reportBtn = document.getElementById("report-btn");


    let isBulbOn = localStorage.getItem('isBulbOn') === 'true';
    let bulbOnTimeSeconds = parseInt(localStorage.getItem('bulbOnTimeSeconds')) || 0;
    let interval;

    toggleBtn.addEventListener("click", function() {
        isBulbOn = !isBulbOn;
        localStorage.setItem('isBulbOn', isBulbOn);
        updateBulbStatus();

        if (isBulbOn) {
            interval = setInterval(() => {
                bulbOnTimeSeconds++;
                localStorage.setItem('bulbOnTimeSeconds', bulbOnTimeSeconds);
                updateAnalysisSection();
            }, 1000);
        } else {
            clearInterval(interval);
        }
    });

    reportBtn.addEventListener("click", function() {
        const bulbUsageData = JSON.parse(localStorage.getItem("bulbUsageData")) || {};

    
        // Loop over the past seven days
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
            const bulbOnTimeSeconds = parseInt(localStorage.getItem(`bulbOnTimeSeconds`)) || 0;
    
            if (!bulbUsageData[currentDate]) {
                bulbUsageData[currentDate] = {
                    date: currentDate,
                    onTime: bulbOnTimeSeconds
                };
            }
    
        // Save bulbUsageData to a JSON file
        const jsonData = JSON.stringify(bulbUsageData, null, 2); // Beautify JSON
        const blob = new Blob([jsonData], { type: "application/json" });
        const fileName = "bulb_usage_data.json";
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    
        window.location.href = "report.html";
    });
    

    function updateBulbStatus() {
        if (isBulbOn) {
            imgElement.src = "./images/ONbulb.png";
            document.body.style.backgroundColor = "black";
            bulbStatus.style.color = "white";
            analysisSection.style.color = "white";
            bulbStatus.textContent = "Bulb Status: On";
            toggleBtn.textContent = "Turn Off";
        } else {
            imgElement.src = "./images/OFFbulb.png";
            document.body.style.backgroundColor = "whitesmoke";
            bulbStatus.style.color = "black";
            analysisSection.style.color = "black";
            bulbStatus.textContent = "Bulb Status: Off";
            toggleBtn.textContent = "Turn On";
        }
    }

    function updateAnalysisSection() {
        const minutes = Math.floor(bulbOnTimeSeconds / 60);
        const seconds = bulbOnTimeSeconds % 60;
        analysisSection.textContent = `Bulb On Time: ${minutes} minutes : ${seconds} seconds`;
    }

    updateBulbStatus(); 
    updateAnalysisSection(); 
});


document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("table-body");
    const bulbUsageData = {
        "2024-04-10": {
            "date": "2024-04-10",
            "onTime": 7740
        },"2024-04-11": {
            "date": "2024-04-11",
            "onTime": 6970
        },"2024-04-12": {
            "date": "2024-04-12",
            "onTime": 10070
        },"2024-04-13": {
            "date": "2024-04-13",
            "onTime": 997
        },"2024-04-14": {
            "date": "2024-04-14",
            "onTime": 0
        },"2024-04-15": {
            "date": "2024-04-15",
            "onTime": 2000
        },"2024-04-16": {
            "date": "2024-04-16",
            "onTime": 4500
        },
        "2024-04-17": {
            "date": "2024-04-17",
            "onTime": 770
        },
        "2024-04-18": {
            "date": "2024-04-18",
            "onTime": 200
        },
        "2024-04-19": {
            "date": "2024-04-19",
            "onTime": 550
        },
        "2024-04-20": {
            "date": "2024-04-20",
            "onTime": 100
        },
        "2024-04-21": {
            "date": "2024-04-21",
            "onTime": 4030
        },
        "2024-04-22": {
            "date": "2024-04-22",
            "onTime": 322
        },
        "2024-04-23": {
            "date": "2024-04-23",
            "onTime": 511
        },
        "2024-04-24": {
            "date": "2024-04-24",
            "onTime": 869
        },
        "2024-04-25": {
            "date": "2024-04-25",
            "onTime": 723
        },
        "2024-04-26": {
            "date": "2024-04-26",
            "onTime": 1000
        }
    };

    // Populate table with data
    for (const date in bulbUsageData) {
        const rowData = bulbUsageData[date];
        const row = document.createElement("tr");
        const onTimeMinutes = Math.floor(rowData.onTime / 60); // Calculate on time in minutes
        row.innerHTML = `
            <td>${rowData.date}</td>
            <td>${rowData.onTime}</td>
            <td>${onTimeMinutes}</td>
        `;
        tableBody.appendChild(row);
    }

    // Event listener for "View Graph" button
    document.getElementById("view-graph-btn").addEventListener("click", function() {
        const dates = Object.keys(bulbUsageData);
        const onTimes = dates.map(date => Math.floor(bulbUsageData[date].onTime / 60)); // Calculate on time in minutes

        // Create a line chart
        const ctx = document.getElementById("bulb-chart").getContext("2d");
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Bulb On Time (minutes)',
                    data: onTimes,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 3
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
});
