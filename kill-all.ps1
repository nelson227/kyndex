# Kill all Node processes
$processes = Get-Process -Name node -ErrorAction SilentlyContinue
if ($processes) {
    $processes | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Killed $(($processes | Measure-Object).Count) node processes"
}

# Kill all npm processes
$npmProcesses = Get-Process -Name npm -ErrorAction SilentlyContinue
if ($npmProcesses) {
    $npmProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Killed $(($npmProcesses | Measure-Object).Count) npm processes"
}

# Wait
Start-Sleep -Seconds 2

Write-Host "✓ All processes killed. Ready to start fresh."
