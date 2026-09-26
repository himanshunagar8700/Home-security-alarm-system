// ================================
// HOME SECURITY DASHBOARD
// ================================

let motionEvents = 0;
let alarmActivations = 0;
let normalEvents = 0;

let securityEnabled = true;
let alarmEnabled = true;

let activityData = [];

// -------------------------------
// Helper
// -------------------------------
function $(id) {
    return document.getElementById(id);
}

// -------------------------------
// Update statistics
// -------------------------------
function updateStats() {
    $("motionEvents").textContent = motionEvents;
    $("totalMotionEvents").textContent = motionEvents;
    $("alarmActivations").textContent = alarmActivations;
    $("normalEvents").textContent = normalEvents;
}

// -------------------------------
// Simulate Motion
// -------------------------------
function simulateMotion() {

    if (!securityEnabled) {
        addActivity("Motion ignored - Security OFF", "READY");
        return;
    }

    motionEvents++;

    $("systemStatus").textContent = "ALERT";
    $("motionStatus").textContent = "MOTION DETECTED";

    $("motionTitle").textContent = "Motion Detected!";
    $("motionMessage").textContent =
        "Movement detected by PIR sensor.";

    $("monitorStatus").textContent = "ALERT";

    $("systemStatus").style.color = "#dc2626";
    $("motionStatus").style.color = "#dc2626";

    if (alarmEnabled) {

        alarmActivations++;

        $("alarmStatus").textContent = "ON";
        $("alarmStatus").style.color = "#dc2626";

        $("alarmLight").classList.add("alarm-active");

        document.body.classList.add("alert-mode");

    } else {

        $("alarmStatus").textContent = "OFF";
    }

    $("lastMotionTime").textContent =
        new Date().toLocaleTimeString();

    activityData.push({
        time: new Date().toLocaleTimeString(),
        value: motionEvents
    });

    addActivity("Motion detected", "ALERT");
    addLiveActivity("Motion detected", "ALERT");

    updateStats();
    drawChart();
}

// -------------------------------
// Reset System
// -------------------------------
function resetSystem() {

    $("systemStatus").textContent = "SECURE";
    $("motionStatus").textContent = "NO MOTION";
    $("alarmStatus").textContent = "OFF";

    $("motionTitle").textContent =
        "No Motion Detected";

    $("motionMessage").textContent =
        "PIR sensor is monitoring the area.";

    $("monitorStatus").textContent = "NORMAL";

    $("systemStatus").style.color = "#16a34a";
    $("motionStatus").style.color = "#475569";
    $("alarmStatus").style.color = "#475569";

    $("alarmLight").classList.remove("alarm-active");

    document.body.classList.remove("alert-mode");

    normalEvents++;

    updateStats();

    addActivity("System reset", "READY");
    addLiveActivity("System reset", "READY");
}

// -------------------------------
// Activity Log
// -------------------------------
function addActivity(message, status) {

    const table = $("activityTable");

    if (!table) return;

    const row = document.createElement("tr");

    const time = document.createElement("td");
    time.textContent = new Date().toLocaleTimeString();

    const event = document.createElement("td");
    event.textContent = message;

    const statusCell = document.createElement("td");

    const badge = document.createElement("span");

    badge.textContent = status;

    badge.className =
        status === "ALERT"
            ? "danger-badge"
            : "success-badge";

    statusCell.appendChild(badge);

    row.appendChild(time);
    row.appendChild(event);
    row.appendChild(statusCell);

    table.prepend(row);
}

// -------------------------------
// Live Activity
// -------------------------------
function addLiveActivity(message, status) {

    const container = $("liveActivityList");

    if (!container) return;

    const empty = container.querySelector(".empty-activity");

    if (empty) {
        empty.remove();
    }

    const item = document.createElement("div");

    item.className = "live-activity-item";

    item.innerHTML = `
        <div class="activity-icon">
            ${status === "ALERT" ? "🚨" : "🛡️"}
        </div>

        <div class="activity-content">
            <h3>${message}</h3>
            <p>Event at ${new Date().toLocaleTimeString()}</p>
        </div>

        <span class="${
            status === "ALERT"
                ? "live-alert-badge"
                : "live-ready-badge"
        }">
            ${status}
        </span>
    `;

    container.prepend(item);
}

// -------------------------------
// Alarm Toggle
// -------------------------------
function toggleAlarmSystem() {

    alarmEnabled = !alarmEnabled;

    const button = $("alarmToggle");

    button.textContent =
        alarmEnabled ? "ON" : "OFF";

    button.classList.toggle(
        "active",
        alarmEnabled
    );

    if (!alarmEnabled) {

        $("alarmStatus").textContent = "OFF";

        $("alarmLight").classList.remove(
            "alarm-active"
        );

        document.body.classList.remove(
            "alert-mode"
        );

        addActivity(
            "Alarm system disabled",
            "READY"
        );

    } else {

        addActivity(
            "Alarm system enabled",
            "READY"
        );
    }
}

// -------------------------------
// Security Toggle
// -------------------------------
function toggleSecuritySystem() {

    securityEnabled = !securityEnabled;

    const button = $("securityToggle");

    button.textContent =
        securityEnabled ? "ON" : "OFF";

    button.classList.toggle(
        "active",
        securityEnabled
    );

    if (securityEnabled) {

        $("systemStatus").textContent = "SECURE";

        $("systemStatus").style.color =
            "#16a34a";

        $("motionStatus").textContent =
            "NO MOTION";

        $("monitorStatus").textContent =
            "NORMAL";

        addActivity(
            "Security mode enabled",
            "READY"
        );

    } else {

        $("systemStatus").textContent =
            "DISABLED";

        $("systemStatus").style.color =
            "#64748b";

        $("motionStatus").textContent =
            "MONITORING OFF";

        $("monitorStatus").textContent =
            "DISABLED";

        $("alarmStatus").textContent =
            "OFF";

        $("alarmLight").classList.remove(
            "alarm-active"
        );

        document.body.classList.remove(
            "alert-mode"
        );

        addActivity(
            "Security mode disabled",
            "READY"
        );
    }
}

// -------------------------------
// Clear Log
// -------------------------------
function clearActivityLog() {

    $("activityTable").innerHTML = `
        <tr>
            <td colspan="3"
                style="text-align:center; color:#64748b;">
                No activity events recorded
            </td>
        </tr>
    `;
}

// -------------------------------
// Reset Statistics
// -------------------------------
function resetStatistics() {

    motionEvents = 0;
    alarmActivations = 0;
    normalEvents = 0;
    activityData = [];

    updateStats();

    $("lastMotionTime").textContent = "--:--";

    drawChart();
}
// ================================
// LOGOUT
// ================================

document.addEventListener("DOMContentLoaded", function () {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            window.location.href = "login.html";

        });

    }

});
// -------------------------------
// Export CSV
// -------------------------------
function exportActivityLog() {

    const rows =
        document.querySelectorAll(
            "#activityTable tr"
        );

    let csv = "Time,Event,Status\n";

    rows.forEach(row => {

        const cells =
            row.querySelectorAll("td");

        if (cells.length === 3) {

            csv +=
                `"${cells[0].innerText}",` +
                `"${cells[1].innerText}",` +
                `"${cells[2].innerText}"\n`;
        }
    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = "security_activity_log.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// -------------------------------
// Chart
// -------------------------------
function drawChart() {

    const canvas = $("motionChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 300;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    ctx.clearRect(0, 0, width, height);

    if (activityData.length === 0) {

        ctx.fillStyle = "#64748b";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "No motion events yet",
            width / 2,
            height / 2
        );

        return;
    }

    const left = 50;
    const right = 20;
    const top = 20;
    const bottom = 40;

    const graphWidth =
        width - left - right;

    const graphHeight =
        height - top - bottom;

    const max =
        Math.max(motionEvents, 5);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {

        const y =
            top +
            graphHeight -
            (i / 5) * graphHeight;

        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(
            left + graphWidth,
            y
        );
        ctx.stroke();
    }

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;

    ctx.beginPath();

    activityData.forEach((point, index) => {

        const x =
            left +
            (index /
                Math.max(
                    activityData.length - 1,
                    1
                )) *
            graphWidth;

        const y =
            top +
            graphHeight -
            (point.value / max) *
            graphHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    activityData.forEach((point, index) => {

        const x =
            left +
            (index /
                Math.max(
                    activityData.length - 1,
                    1
                )) *
            graphWidth;

        const y =
            top +
            graphHeight -
            (point.value / max) *
            graphHeight;

        ctx.fillStyle = "#dc2626";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

// -------------------------------
// Date & Time
// -------------------------------
function updateDateTime() {

    const date = $("date");
    const time = $("time");

    if (!date || !time) return;

    const now = new Date();

    date.textContent =
        now.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    time.textContent =
        now.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );
}

// -------------------------------
// Connect Buttons
// -------------------------------
document.addEventListener(
    "DOMContentLoaded",
    function () {

        $("securityToggle").onclick =
            toggleSecuritySystem;

        $("alarmToggle").onclick =
            toggleAlarmSystem;

        $("clearLogButton").onclick =
            clearActivityLog;

        $("resetStatsButton").onclick =
            resetStatistics;

        updateStats();
        updateDateTime();
        drawChart();
    }
);

setInterval(
    updateDateTime,
    1000
);

window.addEventListener(
    "resize",
    drawChart
);